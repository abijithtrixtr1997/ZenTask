import { getAndSetTasksProps, Task } from "@/Interface/Types";
import { supabase } from "@/supabaseClient";

export const getAndSetTasks = ({
  user,
  setCompletedTasks,
  setIncompleteTasks,
}: getAndSetTasksProps) => {
  const getTasks = async () => {
    const { data, error } = await supabase
      .from("Todo")
      .select()
      .eq("uid", user?.id);
    if (error) {
      console.error("Error fetching tasks:", error);
    } else {
      const sortByDueDate = (a: Task, b: Task) => {
        if (!a.Due) return 1;
        if (!b.Due) return -1;

        return new Date(a.Due).getTime() - new Date(b.Due).getTime();
      };

      data.sort(sortByDueDate);
      const checkedTasks = data.filter((task) => task.completed);
      const uncheckedTasks = data.filter((task) => !task.completed);
      const reorderedTasks = [...uncheckedTasks, ...checkedTasks];
      setCompletedTasks(reorderedTasks.filter((task) => task.completed));
      setIncompleteTasks(reorderedTasks.filter((task) => !task.completed));
    }
  };
  getTasks();
};
