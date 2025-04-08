import { User } from "@supabase/supabase-js";

import { useState } from "react";
import { CreateNew } from "../CreateNew";
import { HomeView } from "../HomeView/HomeView";

export const MainApp = ({ user }: { user: User }) => {
  const [taskAdded, setTaskAdded] = useState<boolean>(false);

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
