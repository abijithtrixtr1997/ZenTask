import { Navbar } from "../Navbar/Navbar";
import { User } from "@supabase/supabase-js";
import { TaskList } from "../TaskList/TaskList";
import { useState } from "react";
import { CreateNew } from "../CreateNew";

export const MainApp = ({ user }: { user: User }) => {
  const [taskAdded, setTaskAdded] = useState<boolean>(false);

  return (
    <>
      <div className="main-app">
        <Navbar user={user} />
        <div className="create-new-container">
          <CreateNew setTaskAdded={setTaskAdded} taskAdded={taskAdded} />
        </div>

        <TaskList user={user} taskAdded={taskAdded} />
      </div>
    </>
  );
};
