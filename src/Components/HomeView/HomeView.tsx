import { User } from "@supabase/supabase-js";
import { Flex } from "@mantine/core"; // Import Mantine components
import { useEffect, useState } from "react";
import { DisplayTasks } from "../TaskList/DisplayTasks";
import { supabase } from "../../supabaseClient";
import { Task } from "../../types";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";

interface HomeViewProps {
  user: User;
  homeTasks: Task[];
  setHomeTasks: (value: Task[]) => void;
}

export const HomeView = ({ user, homeTasks, setHomeTasks }: HomeViewProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const tasks = useSelector((state: RootState) => state.todo.tasks);

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
      }
    };
    getTasks();
  }, [user, tasks]);

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
        {loading ? <p>Your tasks are being loaded...</p> : null}
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
