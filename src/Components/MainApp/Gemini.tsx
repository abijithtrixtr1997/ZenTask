import { Button, TextInput, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { Task } from "../../types";
import { GoogleGenAI } from "@google/genai";
import "./MainApp.css";

interface GeminiProps {
  homeTasks: Task[];
}

interface Response {
  task: string;
  dueDate: string;
  response: string;
}

export const Gemini = ({ homeTasks }: GeminiProps) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<Response[] | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const VITE_GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY!;

  const ai = new GoogleGenAI({
    apiKey: VITE_GEMINI_API_KEY,
  });

  const generateGeminiResponse = async () => {
    setLoading(true);
    const timeNow = new Date();
    console.log(timeNow);

    try {
      const responses = await Promise.all(
        homeTasks
          .filter((task) => !task.completed)
          .map(async (task, index) => {
            let dueDate;
            let localDate;
            if (task.Due) {
              dueDate = new Date(task.Due);
              localDate = dueDate.toLocaleString("en-US", {
                dateStyle: "medium",
                timeStyle: "short",
              });
            } else {
              localDate = "No due date";
            }

            // Construct the prompt for each task
            const taskPrompt = `My ${index + 1} task is ${task.Title} with description ${task.description || "No description"} and due date ${localDate}. Provide an approach to complete this task. Provide the answer as html content using div, ul, li, p, b and all related tags for better visual appeal. Omit the normal responses. I only need html body content. This is inside a html content already. Also provide classnames for each content as well. No need to return current time. I have a clock in my page. Show the due data in my current time zone. Don't use UTC;`;
            const timePrompt = `The current time is ${timeNow}. Help me plan my tasks`;

            const result = await ai.models.generateContent({
              model: "gemini-1.5-flash",
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: question
                        ? taskPrompt.concat(timePrompt).concat(question)
                        : taskPrompt.concat(timePrompt),
                    },
                  ],
                },
              ],
            });

            let cleanedResponse = "";
            if (result.text) {
              cleanedResponse = result.text
                .replace(/<!DOCTYPE html>.*<body>/s, "") // Remove everything before <body>
                .replace(/<\/body>.*<\/html>/s, "") // Remove everything after </body>
                .replace(/```html/s, "") // Remove ```html
                .replace(/```/s, "") // Remove ```
                .replace(/<script>.*<\/script>/s, "") // Remove any <script> tags
                .replace(/"/g, "'") // Replace all double quotes with single quotes
                .replace(/\n/g, "") // Remove all newline characters
                .replace(/<body>/g, "") // Remove <body> tag
                .replace(/<\/body>/g, ""); // Remove </body> tag
            }

            return {
              task: task.Title,
              dueDate: localDate,
              response: cleanedResponse,
            };
          })
      );
      setResponse(responses);
    } catch (error) {
      console.error("Gemini error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    generateGeminiResponse();
  };

  useEffect(() => {
    if (homeTasks.length > 0) {
      generateGeminiResponse();
    }
  }, [homeTasks]);

  return (
    <>
      <div className="whole-gemini">
        <form onSubmit={handleGemini} className="gemini-form">
          <TextInput
            className="gemini-input"
            placeholder="Ask something like 'Help me prioritize...'"
            type="text"
            mt={20}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <Button type="submit" mt={20} size="xs" h={"35px"}>
            Ask Gemini
          </Button>
        </form>

        {loading ? (
          <span className="gemini-loading" />
        ) : response ? (
          <div className="gemini-response">
            {response.map((res, index) => (
              <div key={index} className="task-response">
                <Title order={5}>{res.task}</Title>
                <div
                  className="response-content"
                  dangerouslySetInnerHTML={{ __html: res.response }}
                />
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </>
  );
};
