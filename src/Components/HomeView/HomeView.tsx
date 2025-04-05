import { TaskList } from "../TaskList/TaskList";
import { User } from "@supabase/supabase-js";
import { NoteList } from "../NoteList/NoteList";

interface HomeViewProps {
  user: User;
  taskAdded: boolean;
}

export const HomeView = ({ user, taskAdded }: HomeViewProps) => {
  return (
    <div className="home-view">
      <h1>Home</h1>
      <div className="inside-home" style={{ display: "flex" }}>
        <TaskList user={user} taskAdded={taskAdded} />
        <NoteList user={user} taskAdded={taskAdded} />
      </div>
    </div>
  );
};
