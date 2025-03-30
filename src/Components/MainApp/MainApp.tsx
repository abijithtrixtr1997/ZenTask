import { Navbar } from "../Navbar/Navbar";
import { User } from "@supabase/supabase-js";
import { AddTask } from "../AddTask/AddTask";

export const MainApp = ({ user }: { user: User }) => {
  return (
    <>
      <div className="main-app">
        <Navbar user={user} />
        <AddTask />

        {/* <List spacing={"sm"} size="md" center>
          {tasks.map((task, index) => (
            <List.Item
              key={index}
              icon={
                <ThemeIcon color="teal" size={24} radius="xl">
                  <IconCheck size={16} />
                </ThemeIcon>
              }
            >
              {task}
            </List.Item>
          ))}
        </List> */}
      </div>
    </>
  );
};
