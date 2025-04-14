import { User } from "@supabase/supabase-js";
import { CreateNew } from "../CreateNew";
import { HomeView } from "../HomeView/HomeView";
import { GoogleGenAI } from "@google/genai";
import { Button, TextInput } from "@mantine/core";
import { useState } from "react";
import { Task } from "../../types";

interface MainAppProps {
  user: User;
  taskAdded: boolean;
  setTaskAdded: (value: boolean) => void;
  taskUpdated: boolean;
  setTaskUpdated: (value: boolean) => void;
  homeTasks: Task[];
  setHomeTasks: (value: Task[]) => void;
}

export const MainApp = ({ user, homeTasks, setHomeTasks }: MainAppProps) => {
  const VITE_GEMINI_API_KEY: string = import.meta.env.VITE_GEMINI_API_KEY!;
  const [question, setQuestion] = useState<string>("");
  const ai = new GoogleGenAI({
    apiKey: VITE_GEMINI_API_KEY,
  });

  const handleGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    const timeNow = new Date();
    const fullPrompt = `${question}\n\nCurrent time is ${timeNow}.`;
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: fullPrompt,
    });
    console.log(response.text);
  };
  return (
    <>
      <div className="main-app">
        <div className="in-main-app">
          <div className="gemini-group">
            <form onSubmit={handleGemini}>
              <TextInput
                placeholder="Search"
                type="text"
                mt={20}
                onChange={(e) => setQuestion(e.target.value)}
              ></TextInput>
              <Button type="submit" mt={20} size="lg" h={"40px"}>
                Ask Gemini
              </Button>
            </form>
          </div>

          <div className="create-new-container">
            <CreateNew />
          </div>
          <div className="home-view-container">
            <HomeView
              user={user}
              homeTasks={homeTasks}
              setHomeTasks={setHomeTasks}
            />
          </div>
        </div>
      </div>
    </>
  );
};
