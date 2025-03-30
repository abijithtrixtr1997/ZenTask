import { Button, TextInput, List, ThemeIcon } from "@mantine/core";
import { IconCheck, IconClipboardPlus } from "@tabler/icons-react";
import { useState } from "react";
import { Navbar } from "../Navbar/Navbar";
import { User } from "@supabase/supabase-js";

export const MainApp = ({ user }: { user: User }) => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };
  return (
    <>
      <div className="main-app">
        <Navbar user={user} />
        <div className="task-input">
          <TextInput
            className="task-text"
            value={task}
            onChange={(e) => setTask(e.target.value)}
            mb={20}
          />
          <Button className="task-add-button" onClick={addTask} mb={20}>
            <IconClipboardPlus
              className="add-icon"
              size={"2rem"}
              stroke={1.5}
            />
          </Button>
        </div>

        <List spacing={"sm"} size="md" center>
          {tasks.map((task, index) => (
            <List.Item
              key={index}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              {task}
            </List.Item>
          ))}
        </List>
      </div>
    </>
  );
};
