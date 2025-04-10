import { TaskList } from "../TaskList/TaskList";
import { User } from "@supabase/supabase-js";
import { NoteList } from "../NoteList/NoteList";
import { Flex } from "@mantine/core"; // Import Mantine components

interface HomeViewProps {
  user: User;
  taskAdded: boolean;
}

export const HomeView = ({ user, taskAdded }: HomeViewProps) => {
  return (
    <Flex
      className="home-view"
      gap={"lg"}
      direction="column"
      align="center"
      justify="center"
      p={20}
    >
      <h1 className="home-title">Your Day</h1>
      <div className="inside-home" style={{ display: "flex" }}>
        <TaskList user={user} taskAdded={taskAdded} />
        <NoteList user={user} taskAdded={taskAdded} />
      </div>
    </Flex>
  );
};
