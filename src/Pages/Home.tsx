import { LeftBar } from "../Components/LeftBar/Leftbar";
import { MainApp } from "../Components/MainApp/MainApp";
import { User } from "@supabase/supabase-js";
import { NotePage } from "./NotePage";
import { Taskpage } from "./TaskPage";
import { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar/Navbar";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store";
import { supabase } from "../supabaseClient";
import { setTasks } from "../Components/Slices/TodoSlice";
// import { Calendar } from "./Calender";

interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string | null;
  completed: boolean;
  created_at: string;
  Due: string | null;
}

export const Home = ({ user }: { user: User }) => {
  const [currentPage, setCurrentPage] = useState<string>("Main");
  const [taskAdded, setTaskAdded] = useState<boolean>(false);
  const [taskUpdated, setTaskUpdated] = useState<boolean>(false);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const [homeTasks, setHomeTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const dispatch = useDispatch();

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
        console.log(uncheckedTasks, checkedTasks);
        dispatch(setTasks([...uncheckedTasks, ...checkedTasks]));
        setLoading(false); // Set loading to false once tasks are fetched
        console.log(tasks, "tasks");
      }
    };

    getTasks();
  }, [user]);

  useEffect(() => {
    console.log(
      tasks.map((task) => task.completed),
      "tasks"
    );

    const getHomeTasks = () => {
      const oneDay = 24 * 60 * 60 * 1000;
      const today = new Date();
      const tomorrow = new Date(today.getTime() + oneDay);
      const tomorrowTasks = tasks.filter((task: Task) => {
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
      console.log(
        reorderedTomorrowTasks.map((task) => task.completed),
        "reordered tomorrow tasks"
      );
      setHomeTasks(reorderedTomorrowTasks);
      console.log(tomorrowTasks, "tomorrow tasks");
    };
    getHomeTasks();
  }, [tasks]);

  useEffect(() => {
    const mainApp = document.querySelector(".main-app");
    const TaskPage = document.querySelector(".task-page");
    const NotePage = document.querySelector(".note-page");
    // const CalenderPage = document.querySelector(".calender-page");

    switch (currentPage) {
      case "Main": {
        TaskPage?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        mainApp?.classList.remove("inactive");
        // CalenderPage?.classList.add("inactive");
        break;
      }
      case "Note": {
        NotePage?.classList.remove("inactive");
        TaskPage?.classList.add("inactive");
        mainApp?.classList.add("inactive");
        // CalenderPage?.classList.add("inactive");
        break;
      }
      case "Task": {
        TaskPage?.classList.remove("inactive");
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        // CalenderPage?.classList.add("inactive");
        break;
      }
      case "Calender": {
        // CalenderPage?.classList.remove("inactive");
        TaskPage?.classList.add("inactive");
        mainApp?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        break;
      }

      default:
        TaskPage?.classList.add("inactive");
        NotePage?.classList.add("inactive");
    }
  }, [currentPage]);

  return (
    <>
      <div className="App">
        <div className="in-app">
          <LeftBar setCurrentPage={setCurrentPage} />
          <Navbar user={user} />
          {loading ? (
            <div>Loading...</div>
          ) : currentPage === "Main" ? (
            <MainApp
              user={user}
              taskAdded={taskAdded}
              setTaskAdded={setTaskAdded}
              taskUpdated={taskUpdated}
              setTaskUpdated={setTaskUpdated}
              homeTasks={homeTasks}
              setHomeTasks={setHomeTasks}
            />
          ) : currentPage === "Task" ? (
            <Taskpage
              user={user}
              taskAdded={taskAdded}
              taskUpdated={taskAdded}
              setTaskUpdated={setTaskAdded}
            />
          ) : currentPage === "Note" ? (
            <NotePage />
          ) : null}
          {/* <Calendar /> */}
        </div>
      </div>
    </>
  );
};
