import { LeftBar } from "../Components/LeftBar/Leftbar";
import { MainApp } from "../Components/MainApp/MainApp";
import { User } from "@supabase/supabase-js";
import { NotePage } from "./NotePage";
import { Taskpage } from "./TaskPage";
import { useEffect, useState } from "react";
import { Navbar } from "../Components/Navbar/Navbar";

export const Home = ({ user }: { user: User }) => {
  const [currentPage, setCurrentPage] = useState<string>("Main");

  useEffect(() => {
    const mainApp = document.querySelector(".main-app");
    const TaskPage = document.querySelector(".task-page");
    const NotePage = document.querySelector(".note-page");
    switch (currentPage) {
      case "Main": {
        TaskPage?.classList.add("inactive");
        NotePage?.classList.add("inactive");
        mainApp?.classList.remove("inactive");
        break;
      }
      case "Note": {
        NotePage?.classList.remove("inactive");
        TaskPage?.classList.add("inactive");
        mainApp?.classList.add("inactive");
        break;
      }
      case "Task": {
        TaskPage?.classList.remove("inactive");
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
          <MainApp user={user} />
          <NotePage />
          <Taskpage />
        </div>
      </div>
    </>
  );
};
