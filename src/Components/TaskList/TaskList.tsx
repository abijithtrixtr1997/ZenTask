import { User } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { DisplayTasks } from "./DisplayTasks";
import { Box, Collapse, Flex, Group, Title } from "@mantine/core";
import { supabase } from "../../supabaseClient";
import { Task } from "../../types";
import { RootState } from "../../Store";
import { useSelector } from "react-redux";
import "./Tasks.css";
import { useDisclosure } from "@mantine/hooks";
import { IconCaretDown } from "@tabler/icons-react";

interface TaskListProps {
  user: User;
}

export const TaskList = ({ user }: TaskListProps) => {
  const [checkedMap, setCheckedMap] = useState<Record<string, boolean>>({});
  const [localTasks, setLocalTasks] = useState<Task[]>([]);
  const tasks = useSelector((state: RootState) => state.todo.tasks);
  const [incompletedTasks, setIncompleteTasks] = useState<Task[]>(
    localTasks.filter((task) => !task.completed)
  );
  const [completedTasks, setCompletedTasks] = useState<Task[]>(
    localTasks.filter((task) => task.completed)
  );
  const [opened, { toggle }] = useDisclosure(false);

  useEffect(() => {
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
        setLocalTasks(reorderedTasks);
        setCompletedTasks(reorderedTasks.filter((task) => task.completed));
        setIncompleteTasks(reorderedTasks.filter((task) => !task.completed)); // Set loading to false once tasks are fetched
      }
    };
    getTasks();
  }, [tasks, user]);

  const handleSetChecked = (id: string, value: boolean) => {
    setCheckedMap((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <Flex className="task-whole-list" direction="column" align="flex-start">
      <Flex className="incompleted" direction={"column"} gap={0}>
        <Title
          order={3}
          ta={"center"}
          mb={10}
          td={"underline"}
          tt={"uppercase"}
          className="heading-task-status"
          p={10}
        >
          Incomplete
        </Title>
        <div className="whole-task-list">
          {incompletedTasks.length > 0 ? (
            incompletedTasks.map((task) => (
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
        </div>
      </Flex>
      <Box mx="auto" className="collapse-tasks">
        <Group
          justify="center"
          mb={5}
          className="collapse-group"
          onClick={toggle}
        >
          <Title
            order={3}
            ta={"center"}
            td={"underline"}
            tt={"uppercase"}
            className="heading-task-status"
          >
            Completed
          </Title>
          <IconCaretDown
            size={20}
            className={
              opened ? `caret-down-icon-open` : `caret-down-icon-close`
            }
          />
        </Group>

        <Collapse in={opened} className="collapse-tasks">
          <div className="whole-task-list">
            <Flex className="completed" direction={"column"}>
              {completedTasks.length > 0 ? (
                completedTasks.map((task) => (
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
        </Collapse>
      </Box>
    </Flex>
  );
};
