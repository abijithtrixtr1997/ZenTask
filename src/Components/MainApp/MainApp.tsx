import { User } from "@supabase/supabase-js";
import { CreateNew } from "../CreateNew";
import { HomeView } from "../HomeView/HomeView";
import { GoogleGenAI } from "@google/genai";
import { Button, TextInput } from "@mantine/core";
import { useEffect, useState } from "react";

interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
}

interface MainAppProps {
  user: User;
  taskAdded: boolean;
  setTaskAdded: (value: boolean) => void;
  taskUpdated: boolean;
  setTaskUpdated: (value: boolean) => void;
  homeTasks: Task[];
  setHomeTasks: (value: Task[]) => void;
}

export const MainApp = ({
  user,
  taskAdded,
  setTaskAdded,
  taskUpdated,
  setTaskUpdated,
  homeTasks,
  setHomeTasks,
}: MainAppProps) => {
  const [question, setQuestion] = useState<string>("");
  const ai = new GoogleGenAI({
    apiKey: "AIzaSyD6qx0XLi0wlvRtvXmUIuzmj1s9TeVyC8s",
  });

  useEffect(() => {
    const timeNow = new Date();
    const saveBasicInfo = async () => {
      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: `Time now is ${timeNow}`,
      });
      console.log(response.text);
    };
    saveBasicInfo();
  }, []);

  const handleGemini = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: question,
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
            <CreateNew setTaskAdded={setTaskAdded} taskAdded={taskAdded} />
          </div>
          <div className="home-view-container">
            <HomeView
              user={user}
              taskAdded={taskAdded}
              taskUpdated={taskUpdated}
              setTaskUpdated={setTaskUpdated}
              homeTasks={homeTasks}
              setHomeTasks={setHomeTasks}
            />
          </div>
        </div>
      </div>
    </>
  );
};
