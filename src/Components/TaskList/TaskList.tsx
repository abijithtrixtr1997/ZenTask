import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { Flex } from "@mantine/core";
import { supabase } from "../../supabaseClient";
import { Task } from "../../types";
import { RootState } from "../../Store";
import { useSelector } from "react-redux";

interface TaskListProps {
  user: User;
  taskAdded: boolean;
  taskUpdated: boolean;
  setTaskUpdated: (value: boolean) => void;
}

export const TaskList = ({ user }: TaskListProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const [incompletedTasks, setIncompleteTasks] = useState<Task[]>(
    localTasks.filter((task) => !task.completed)
  );
  const [completedTasks, setCompletedTasks] = useState<Task[]>(
    localTasks.filter((task) => task.completed)
  );

  useEffect(() => {
    const getTasks = async () => {
      setLoading(true); // Set loading to true when starting the fetch
      const { data, error } = await supabase
        .from("Todo")
        .select()
        .eq("uid", user?.id);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        const checkedTasks = data.filter((task) => task.completed);
        const uncheckedTasks = data.filter((task) => !task.completed);
        const reorderedTasks = [...uncheckedTasks, ...checkedTasks];
        setLocalTasks(reorderedTasks);
        setLoading(false);
        setCompletedTasks(reorderedTasks.filter((task) => task.completed));
        setIncompleteTasks(reorderedTasks.filter((task) => !task.completed)); // Set loading to false once tasks are fetched
      }
    };
    getTasks();
  }, [tasks, user]);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Flex className="task-whole-list" direction="row" align="flex-start">
      {loading ? <p>Your tasks are being loaded...</p> : null}
      <Flex className="completed" direction={"column"}>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <DisplayTasks
              key={task.id}
              task={task}
              checked={checkedMap[task.id] || false}
              setChecked={(value: boolean) => handleSetChecked(task.id, value)}
            />
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </Flex>
      <Flex className="uncompleted" direction={"column"}>
        {incompletedTasks.length > 0 ? (
          incompletedTasks.map((task) => (
            <DisplayTasks
              key={task.id}
              task={task}
              checked={checkedMap[task.id] || false}
              setChecked={(value: boolean) => handleSetChecked(task.id, value)}
            />
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </Flex>
    </Flex>
  );
};
