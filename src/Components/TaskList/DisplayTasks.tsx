import { Checkbox, Container, Flex, Text, Title } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { updateTaskInDB, updateTaskLocally } from "../Slices/TodoSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Store";
import { IconCheck, IconTrashFilled } from "@tabler/icons-react";
import { format } from "date-fns";
import { DateTimePicker } from "../Date_And_Time/Time";
import { deleteTask } from "./DeleteTask";

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
  setTaskDeleted: (value: boolean) => void;
  taskDeleted: boolean;
  taskUpdated: boolean;
  setTaskUpdated: (value: boolean) => void;
}

export const DisplayTasks = ({
  task,
  checked,
  setChecked,
  setTaskDeleted,
  taskDeleted,
  taskUpdated,
  setTaskUpdated,
}: DisplayTasksProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.Title);
  const [editDescription, setEditDescription] = useState(
    task.description ?? ""
  );
  const [selectedTime, setSelectedTime] = useState(task.Due ?? "");
  const [showMoreFields, setShowMoreFields] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const tasks = useSelector((state: RootState) => state.todo.tasks);

  useEffect(() => {
    setChecked(task.completed);
  }, [task.completed]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        handleSave();
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isEditing, editTitle, editDescription, selectedTime]);

  const handleCheck = async () => {
    const newChecked = !checked;
    setChecked(newChecked);
    setTaskUpdated(!taskUpdated);
    console.log(checked, "checked from displaytasks");
    const updatedTask = { ...task, completed: checked };
    const updatedTasks = tasks.map((t) => (t.id === task.id ? updatedTask : t));

    dispatch(updateTaskLocally(updatedTasks));
    setLoading(true);
    try {
      await dispatch(
        updateTaskInDB({
          id: task.id,
          updates: { completed: newChecked },
        })
      );
    } catch (error) {
      setChecked(!newChecked);
      console.error("Failed to update task:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    console.log("Saving changes...");
    setTimeout(async () => {
      setLoading(true);
      try {
        const dueToUpdate = selectedTime?.trim()
          ? new Date(selectedTime).toISOString()
          : null;

        await dispatch(
          updateTaskInDB({
            id: task.id,
            updates: {
              Title: editTitle,
              description: editDescription.trim() || null,
              Due: dueToUpdate,
            },
          })
        );
        setIsEditing(false);
      } catch (err) {
        console.error("Failed to update task:", err);
      } finally {
        setLoading(false);
      }
    }, 100);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSave();
  };

  const handleDelete = () => {
    deleteTask(task.id, dispatch, setTaskDeleted, taskDeleted);
  };

  return (
    <div className="outer-display-task">
      <Container className="display-task" maw={400} p={10}>
        <Flex
          className="individual-task"
          gap="xs"
          direction="column"
          align="flex-start"
          onDoubleClick={handleEdit}
        >
          <div ref={editorRef}>
            {isEditing ? (
              <>
                <input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="task-title-input"
                  autoFocus
                />

                {(editDescription || selectedTime || showMoreFields) && (
                  <>
                    <textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      onKeyDown={handleKeyDown}
                      className="task-description-input"
                      placeholder="Add description..."
                    />
                    <DateTimePicker setSelectedTime={setSelectedTime} />
                  </>
                )}

                {!editDescription && !selectedTime && !showMoreFields && (
                  <button
                    className="more-button"
                    onClick={() => setShowMoreFields(true)}
                    title="Add description or due date"
                    onMouseDown={(e) => e.preventDefault()}
                  >
                    ⋯
                  </button>
                )}
              </>
            ) : (
              <>
                <Title
                  order={5}
                  className="task-title"
                  style={{
                    wordBreak: "break-word",
                    textTransform: "uppercase",
                    textDecoration: checked ? "line-through" : "none",
                  }}
                >
                  {editTitle}
                </Title>
                {editDescription && <Text size="xs">{editDescription}</Text>}
                {selectedTime && (
                  <Text size="xs">
                    Due: {format(new Date(selectedTime), "dd-MM HH:mm")}
                  </Text>
                )}
              </>
            )}
          </div>
          <div
            className="toggle-checkbox"
            onClick={handleCheck}
            role="checkbox"
            aria-checked={checked}
            tabIndex={0}
          >
            <Checkbox
              readOnly
              checked={checked}
              disabled={loading}
              className="done-toggle"
            />
            <span className="done-toggle-display">
              <IconCheck
                size={15}
                className={checked ? `done-icon-true` : `done-icon-false`}
                color={checked ? "#8f9562" : "#ccc"}
              />
            </span>
          </div>

          <div className="edit-delete">
            <button className="delete-button" onClick={handleDelete}>
              <IconTrashFilled className="delete-icon" size={15} color="#000" />
            </button>
          </div>
        </Flex>
      </Container>
    </div>
  );
};
