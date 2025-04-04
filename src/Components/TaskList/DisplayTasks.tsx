import { Container, Text } from "@mantine/core";

interface Task {
  id: string;
  Title: string;
  description: string;
  completed: boolean;
  created_at: string;
  uid: string;
}

interface DisplayTasks {
  task: Task;
}

export const DisplayTasks = ({ task }: DisplayTasks) => {
  return (
    <Container className="display-task">
      <Text>{task?.Title}</Text>
    </Container>
  );
};
