import { LeftBar } from "../Components/LeftBar/Leftbar";
import { MainApp } from "../Components/MainApp/MainApp";
import { User } from "@supabase/supabase-js";

export const Home = ({ user }: { user: User }) => {
  return (
    <>
      <div className="App">
        <div className="in-app">
          <LeftBar />
          <MainApp user={user} />
        </div>
      </div>
    </>
  );
};
