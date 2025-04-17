import { CreateNew } from "../CreateNew";
import { HomeView } from "../HomeView/HomeView";

import { Task } from "../../types";
import { Gemini } from "./Gemini";

interface MainAppProps {
  homeTasks: Task[];
}

export const MainApp = ({ homeTasks }: MainAppProps) => {
  return (
    <div className="main-app">
      <div className="in-main-app">
        <Gemini homeTasks={homeTasks} />

        <div className="create-new-container">
          <CreateNew />
        </div>
        <div className="home-view-container">
          <HomeView homeTasks={homeTasks} />
        </div>
      </div>
    </div>
  );
};
