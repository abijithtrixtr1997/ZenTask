import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import { DisplayTasks } from "./DisplayTasks";

interface Task {
  id: string;
  Title: string;
  description: string;
  completed: boolean;
  created_at: string;
  uid: string;
}

interface TaskListProps {
  user: User;
  taskAdded: boolean;
}

export const TaskList = ({ user, taskAdded }: TaskListProps) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    const getTasks = async () => {
      const { data, error } = await supabase
        .from("Todo")
        .select()
        .eq("uid", user?.id);
      console.log(typeof data);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setTasks(data); // Store all task objects instead of just 'task'
      }
    };

    getTasks();
  }, [taskAdded, user]); // Re-fetch when `user` changes

  useEffect(() => {
    console.log("Tasks after update:", tasks);
  }, [tasks]);

  return (
    <div>
      {tasks.length > 0 ? (
        tasks.map((task) => <DisplayTasks key={task?.id} task={task} />)
      ) : (
        <li>No tasks found</li>
      )}
    </div>
  );
};
