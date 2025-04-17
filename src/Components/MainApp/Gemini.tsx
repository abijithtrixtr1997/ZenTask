import { Button, TextInput, Skeleton } from "@mantine/core";
import { useEffect, useState } from "react";
import { Task } from "../../types";
import { GoogleGenAI } from "@google/genai";
import "./MainApp.css";

interface GeminiProps {
  homeTasks: Task[];
}

export const Gemini = ({ homeTasks }: GeminiProps) => {
  const [question, setQuestion] = useState<string>("");
  const [response, setResponse] = useState<string | undefined>();
  const [loading, setLoading] = useState<boolean>(false);

  const VITE_GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY!;

  const ai = new GoogleGenAI({
    apiKey: VITE_GEMINI_API_KEY,
  });

  const generateGeminiResponse = async (customPrompt?: string) => {
    setLoading(true);
    const timeNow = new Date();
    let count = 1;
    let setTaskLst = homeTasks.map((task) => {
      return `My ${count++} task is ${task.Title} with description ${task.description} and due date ${task.Due}.`;
    });
    const formattedTasks = setTaskLst.join("\n");
    const fullPrompt = `${customPrompt || question}\n\nCurrent time is ${timeNow}.\n\nThese are my tasks left today:\n\n${formattedTasks}\n\nProvide an approach to complete them. Provide the answer as html content using div, ul, li, p, b and all related tags for better visual appeal. Omit the normal responses. I only need html body content. This is inside a html content already. Also provide classnames for each content as well. No need to return current time. I have a clock in my page. Show the due data in my current time zone. Don't use UTC`;

    try {
      const result = await ai.models.generateContent({
        model: "gemini-1.5-flash",
        contents: [
          {
            role: "user",
            parts: [{ text: fullPrompt }],
          },
        ],
      });
      if (result.text) {
        const cleanedResponse = result.text
          .replace(/<!DOCTYPE html>.*<body>/s, "")
          .replace(/<\/body>.*<\/html>/s, "")
          .replace(/```html/s, "")
          .replace(/```/s, "")
          .replace(/<script>.*<\/script>/s, "")
          .replace(/"/g, "'");
        setResponse(cleanedResponse);
      }
    } catch (error) {
      console.error("Gemini error:", error);
      setResponse("Something went wrong. Please try again.");
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
      generateGeminiResponse("Hello Gemini! Help me plan my tasks.");
    }
  }, [homeTasks]);

  return (
    <>
      <form onSubmit={handleGemini}>
        <TextInput
          placeholder="Ask something like 'Help me prioritize...'"
          type="text"
          mt={20}
          onChange={(e) => setQuestion(e.target.value)}
        />
        <Button type="submit" mt={20} size="lg" h={"40px"}>
          Ask Gemini
        </Button>
      </form>
      {loading ? (
        <Skeleton height={200} mt={20} radius="md" />
      ) : response ? (
        <div
          className="gemini-response"
          dangerouslySetInnerHTML={{ __html: response }}
        />
      ) : null}
    </>
  );
};
