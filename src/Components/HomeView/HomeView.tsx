import { User } from "@supabase/supabase-js";
import { Flex } from "@mantine/core"; // Import Mantine components
import { useEffect, useState } from "react";
import { DisplayTasks } from "../TaskList/DisplayTasks";
import { supabase } from "../../supabaseClient";

interface HomeViewProps {
  user: User;
  taskUpdated: boolean;
  setTaskUpdated: (value: boolean) => void;
  homeTasks: Task[];
  setHomeTasks: (value: Task[]) => void;
  taskAdded: boolean;
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

export const HomeView = ({
  user,
  taskUpdated,
  setTaskUpdated,
  homeTasks,
  setHomeTasks,
  taskAdded,
}: HomeViewProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [taskDeleted, setTaskDeleted] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };
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
        const oneDay = 24 * 60 * 60 * 1000;
        const today = new Date();
        const tomorrow = new Date(today.getTime() + oneDay);
        const tomorrowTasks = data.filter((task: Task) => {
          if (!task.Due) return false;
          const taskDate = new Date(task.Due);
          return (
            taskDate.getFullYear() === tomorrow.getFullYear() &&
            taskDate.getMonth() === tomorrow.getMonth() &&
            (taskDate.getDate() === tomorrow.getDate() ||
              taskDate.getDate() === today.getDate())
          );
        });
        const unchekedTomorrowTasks = tomorrowTasks.filter(
          (task) => !task.completed
        );
        const checkedTomorrowTasks = tomorrowTasks.filter(
          (task) => task.completed
        );
        const reorderedTomorrowTasks = [
          ...unchekedTomorrowTasks,
          ...checkedTomorrowTasks,
        ];
        setHomeTasks(reorderedTomorrowTasks);
        setLoading(false);
        console.log(loading);
      }
    };
    getTasks();
  }, [taskDeleted, taskUpdated, user, taskAdded]);

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
        <Flex className="task-whole-list" direction="column" align="flex-start">
          {homeTasks.length > 0 ? (
            homeTasks.map((task) => (
              <DisplayTasks
                key={task.id}
                task={task}
                checked={checkedMap[task.id] || false}
                setChecked={(value: boolean) =>
                  handleSetChecked(task.id, value)
                }
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
      </div>
    </Flex>
  );
};
