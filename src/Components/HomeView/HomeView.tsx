import { Flex } from "@mantine/core";
import { useState } from "react";
import { DisplayTasks } from "../TaskList/DisplayTasks";
import { Task } from "../../types";

interface HomeViewProps {
  homeTasks: Task[];
}

export const HomeView = ({ homeTasks }: HomeViewProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

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
