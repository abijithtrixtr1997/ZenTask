import { User } from "@supabase/supabase-js";
import { CreateNew } from "../CreateNew";
import { HomeView } from "../HomeView/HomeView";

interface MainAppProps {
  user: User;
  taskAdded: boolean;
  setTaskAdded: (value: boolean) => void;
}

export const MainApp = ({ user, taskAdded, setTaskAdded }: MainAppProps) => {
  return (
    <>
      <div className="main-app">
        <div className="in-main-app">
          <div className="create-new-container">
            <CreateNew setTaskAdded={setTaskAdded} taskAdded={taskAdded} />
          </div>
          <div className="home-view-container">
            <HomeView taskAdded={taskAdded} user={user} />
          </div>
        </div>
      </div>
    </>
  );
};
