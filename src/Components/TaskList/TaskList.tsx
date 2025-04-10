import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { Flex } from "@mantine/core";
import { useDispatch, useSelector } from "react-redux";
import { setTasks } from "../Slices/TodoSlice";
import { RootState } from "../../Store";

interface TaskListProps {
  user: User;
  taskAdded: boolean;
}

export const TaskList = ({ user, taskAdded }: TaskListProps) => {
  const dispatch = useDispatch(); // Initialize Redux dispatch
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({}); // Track task checked state
  const [taskDeleted, setTaskDeleted] = useState(false); // Track task]
  const tasks = useSelector((state: RootState) => state.todo.tasks); // Get tasks from Redux state

  // Fetch tasks from Supabase
  useEffect(() => {
    const getTasks = async () => {
      const { data, error } = await supabase
        .from("Todo")
        .select()
        .eq("uid", user?.id);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        const checkedTasks = data.filter((task) => task.completed);
        const uncheckedTasks = data.filter((task) => !task.completed);
        const reorderedTasks = [...uncheckedTasks, ...checkedTasks]; // Move completed tasks to the bottom

        dispatch(setTasks(reorderedTasks)); // Dispatch reordered tasks to Redux // Dispatch tasks to Redux
      }
    };

    getTasks();
  }, [taskAdded, user, dispatch, taskDeleted]); // Re-fetch tasks when `taskAdded` or `user` changes

  // Update tasks order whenever the checked state changes
  useEffect(() => {
    const reorderTasks = () => {
      // Filter checked and unchecked tasks
      const checkedTasks = tasks.filter((task) => checkedMap[task.id]);
      const uncheckedTasks = tasks.filter((task) => !checkedMap[task.id]);

      // Reorder tasks: unchecked tasks first, then checked tasks
      const reorderedTasks = [...uncheckedTasks, ...checkedTasks];
      dispatch(setTasks(reorderedTasks)); // Dispatch reordered tasks to Redux
    };

    reorderTasks(); // Call reorder whenever `checkedMap` or `tasks` changes
  }, [checkedMap, taskDeleted]); // Dependency on `checkedMap`, `tasks`, and `dispatch`

  // Handle checkbox change and update checkedMap
  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Flex className="task-whole-list" direction="column" align="flex-start">
      {tasks.length > 0 ? (
        tasks.map((task) => (
          <DisplayTasks
            key={task.id}
            task={task}
            checked={checkedMap[task.id] || false} // Ensure checked state is used
            setChecked={(value: boolean) => handleSetChecked(task.id, value)} // Update checked state
            setTaskDeleted={setTaskDeleted}
            taskDeleted={taskDeleted}
          />
        ))
      ) : (
        <li>No tasks found</li>
      )}
    </Flex>
  );
};
