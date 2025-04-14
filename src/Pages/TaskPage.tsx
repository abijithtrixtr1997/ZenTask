import { TaskList } from "../Components/TaskList/TaskList";
import { User } from "@supabase/supabase-js";
import "./Taskpage.css";

interface TaskpageProps {
  user: User;
}

export const Taskpage = ({ user }: TaskpageProps) => {
  return (
    <div className="task-page">
      <header className="task-header">
        <h1>
          Welcome back,{" "}
          {user?.identities?.[0]?.identity_data?.full_name || "User"}
        </h1>

        <p>Here's what's on your plate today. Let’s get things done!</p>
      </header>
      <section className="task-list-section">
        <TaskList user={user} />
      </section>
    </div>
  );
};
