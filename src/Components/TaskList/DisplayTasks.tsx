import { Checkbox, Container, Flex, Text, Title } from "@mantine/core";
import { useState, useEffect, useRef } from "react";
import { updateTaskInDB, updateTaskLocally } from "../Slices/TodoSlice";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../Store";
import {
  IconCheck,
  IconPencil,
  IconTrashFilled,
  IconX,
} from "@tabler/icons-react";
import { format, formatDistanceToNow, differenceInMinutes } from "date-fns";
import { DateTimePicker } from "../Date_And_Time/Time";
import { deleteTask } from "./DeleteTask";
import { Task } from "../../types";
import "./Tasks.css";

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
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(task.Title);
  const [editDescription, setEditDescription] = useState(
    task.description ?? ""
  );
  const [selectedTime, setSelectedTime] = useState(task.Due ?? "");
  const [showMoreFields, setShowMoreFields] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const innerRef = useRef<HTMLDivElement>(null);
  const outerRef = useRef<HTMLDivElement>(null);

  const getDueColor = (minutesUntilDue: number) => {
    if (!checked) {
      if (minutesUntilDue < 0) return "red"; // Overdue
      if (minutesUntilDue < 60) return "orange"; // Due in < 1 hour
      if (minutesUntilDue < 1440) return "yellow"; // Due within a day
      return "green"; // More than a day left
    }
  };

  useEffect(() => {
    setChecked(task.completed);
  }, [task.completed]);

  useEffect(() => {
    const taskEl = innerRef.current;
    const outerEl = outerRef.current;

    const handleMouseEnter = () => {
      outerEl?.classList.add("hovered");
    };

    const handleMouseLeave = () => {
      outerEl?.classList.remove("hovered");
    };

    if (taskEl) {
      taskEl.addEventListener("mouseenter", handleMouseEnter);
      taskEl.addEventListener("mouseleave", handleMouseLeave);
    }

    return () => {
      if (taskEl) {
        taskEl.removeEventListener("mouseenter", handleMouseEnter);
        taskEl.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        editorRef.current &&
        !editorRef.current.contains(event.target as Node)
      ) {
        handleSave();
      }
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleSave();
      }
    }

    if (isEditing) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isEditing, editTitle, editDescription, selectedTime]);

  const handleCheck = async () => {
    const newChecked = !checked;
    setChecked(newChecked);
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
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
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
    deleteTask(task.id, dispatch);
  };

  return (
    <div className="outer-display-task" ref={outerRef}>
      <Container className="display-task" p={10} ref={innerRef}>
        <Flex
          ref={editorRef}
          className={isEditing ? `individual-task editing` : `individual-task`}
          gap="xs"
          onDoubleClick={handleEdit}
        >
          <div
            ref={editorRef}
            className={
              isEditing
                ? `title-description-container editing`
                : `title-description-container`
            }
          >
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
                    <DateTimePicker
                      setSelectedTime={setSelectedTime}
                      selectedTime={selectedTime}
                    />
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
              <div className="title-description">
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
                {selectedTime &&
                  (() => {
                    const dueDate = new Date(selectedTime);
                    const minutesUntilDue = differenceInMinutes(
                      dueDate,
                      new Date()
                    );
                    const color = getDueColor(minutesUntilDue);

                    return (
                      <Text size="xs" c={color}>
                        ⏰ Due{" "}
                        {formatDistanceToNow(dueDate, { addSuffix: true })}
                        {", "}
                        {format(dueDate, "dd MMM, hh:mm a")}
                      </Text>
                    );
                  })()}
              </div>
            )}
          </div>
          <div className="manipulation-group">
            <div
              className="toggle-checkbox"
              role="checkbox"
              aria-checked={checked}
              tabIndex={0}
            >
              <div className="delete-task">
                <button className="edit-button" onClick={handleEdit}>
                  {isEditing ? (
                    <IconX className="close-icon" size={15} />
                  ) : (
                    <IconPencil className="edit-icon" size={15} />
                  )}
                </button>

                <button className="delete-button" onClick={handleDelete}>
                  <IconTrashFilled className="delete-icon" size={15} />
                </button>
              </div>
              <Checkbox
                readOnly
                checked={checked}
                disabled={loading}
                className="done-toggle"
              />
              <span className="done-toggle-display" onClick={handleCheck}>
                <IconCheck
                  size={15}
                  className={checked ? `done-icon-true` : `done-icon-false`}
                  color={checked ? "#000" : "#ccc"}
                />
              </span>
            </div>
            {isEditing && (
              <button className="save-button" onClick={handleSave}>
                Save
              </button>
            )}
          </div>
        </Flex>
      </Container>
    </div>
  );
};
