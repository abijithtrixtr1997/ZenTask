import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { Flex } from "@mantine/core";
import { supabase } from "../../supabaseClient";

interface TaskListProps {
  user: User;
  taskAdded: boolean;
  taskUpdated: boolean;
  setTaskUpdated: (value: boolean) => void;
}

interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
}

export const TaskList = ({
  user,
  taskAdded,
  taskUpdated,
  setTaskUpdated,
}: TaskListProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [taskDeleted, setTaskDeleted] = useState(false);
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
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
        console.log(reorderedTasks, "reordered tasks");
        setLocalTasks(reorderedTasks);
        setLoading(false);
        console.log(loading);
        setCompletedTasks(reorderedTasks.filter((task) => task.completed));
        setIncompleteTasks(reorderedTasks.filter((task) => !task.completed)); // Set loading to false once tasks are fetched
      }
    };
    const timeout = setTimeout(() => {
      getTasks();
    }, 500);

    return () => clearTimeout(timeout);
  }, [taskUpdated, taskDeleted, user, taskAdded]);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Flex className="task-whole-list" direction="row" align="flex-start">
      <Flex className="completed" direction={"column"}>
        {completedTasks.length > 0 ? (
          completedTasks.map((task) => (
            <DisplayTasks
              key={task.id}
              task={task}
              checked={checkedMap[task.id] || false}
              setChecked={(value: boolean) => handleSetChecked(task.id, value)}
              setTaskDeleted={setTaskDeleted}
              taskDeleted={taskDeleted}
              taskUpdated={taskUpdated}
              setTaskUpdated={setTaskUpdated}
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
              setTaskDeleted={setTaskDeleted}
              taskDeleted={taskDeleted}
              taskUpdated={taskUpdated}
              setTaskUpdated={setTaskUpdated}
            />
          ))
        ) : (
          <li>No tasks found</li>
        )}
      </Flex>
    </Flex>
  );
};
