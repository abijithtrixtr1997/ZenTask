import { TextInput, Button } from "@mantine/core";
import { IconClipboardPlus } from "@tabler/icons-react";
import { useState } from "react";

export const AddTask = () => {
  const [task, setTask] = useState<string>("");
  const [tasks, setTasks] = useState<string[]>([]);

  const addTask = () => {
    if (task.trim()) {
      setTasks([...tasks, task]);
      setTask("");
    }
  };

  return (
    <div className="task-input">
      <TextInput
        className="task-text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        mb={20}
      />
      <Button className="task-add-button" onClick={addTask} mb={20}>
        <IconClipboardPlus className="add-icon" size={"2rem"} stroke={1.5} />
      </Button>
    </div>
  );
};
