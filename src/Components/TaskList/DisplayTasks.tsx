import { Checkbox, Container, Flex, Text, Title } from "@mantine/core";
import { useState, useEffect } from "react";
import { updateTaskInDB } from "../Slices/TodoSlice";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "../../Store";
import { IconCheck, IconPencil, IconTrashFilled } from "@tabler/icons-react";
import { format } from "date-fns";

interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
}

interface DisplayTasksProps {
  task: Task;
  checked: boolean;
  setChecked: (value: boolean) => void;
}

export const DisplayTasks = ({
  task,
  checked,
  setChecked,
}: DisplayTasksProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [clicked, setClicked] = useState(false);

  const handleCheck = async () => {
    console.log("handleCheck clicked: ", checked);
    const newChecked = !checked;
    console.log("checked new value: ", newChecked);
    setChecked(newChecked);
    console.log("Checked value:", checked);
    setLoading(true);

    try {
      console.log("In try block");
      await dispatch(
        updateTaskInDB({
          id: task.id,
          updates: { completed: newChecked },
        })
      );
    } catch (error) {
      // Revert state if update fails
      setChecked(!newChecked);
      console.error("Failed to update task:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setChecked(task.completed);
  }, [task.completed]);

  const handleClick = () => {
    console.log(clicked);
    setClicked(!clicked);
  };

  return (
    <Container
      className="display-task"
      maw={400}
      mb={10}
      p={10}
      onClick={handleClick}
    >
      <Flex
        className="individual-task"
        gap="xs"
        direction="column"
        align="flex-start"
      >
        <Title
          order={5}
          className="task-title"
          style={{
            wordBreak: "break-word",
            textTransform: "uppercase",
            textDecoration: checked ? "line-through" : "none",
          }}
        >
          {task.Title}
        </Title>

        {task.description && <Text size="xs">{task.description}</Text>}
        {task.Due && (
          <Text size="xs">
            Due: {format(new Date(task.Due), "dd-MM HH:mm")}
          </Text>
        )}
        <div
          className="toggle-checkbox"
          onClick={handleCheck}
          role="checkbox"
          aria-checked={checked}
          tabIndex={0}
        >
          <Checkbox
            checked={checked}
            onChange={handleCheck}
            disabled={loading}
            className="done-toggle"
          />
          <span className="done-toggle-display">
            <IconCheck
              size={15}
              className={checked ? `done-icon-true` : `done-icon-false`}
              color={checked ? "#8f9562" : "#ccc"}
            ></IconCheck>
          </span>
        </div>
        <div className="edit-delete">
          <button className="edit-button">
            <IconPencil className="edit-icon" size={15} color="#8f9562" />
          </button>
          <button className="delete-button">
            <IconTrashFilled
              className="delete-icon"
              size={15}
              color="#8f9562"
            />
          </button>
        </div>
      </Flex>
    </Container>
  );
};
