import {
  Box,
  Button,
  Center,
  Collapse,
  Container,
  Flex,
  Group,
} from "@mantine/core";
import {
  // IconCalendarPlus,
  IconNote,
  IconPlus,
  IconSquarePlus,
} from "@tabler/icons-react";
import { useDisclosure } from "@mantine/hooks";
import { useState, useEffect } from "react";
import { FloatingContainer } from "./AddNew/AddFloating";

interface AddTaskProps {
  setTaskAdded: (taskAdded: boolean) => void;
  taskAdded: boolean; // Function to notify the parent that task was added
}

export const CreateNew = ({ taskAdded, setTaskAdded }: AddTaskProps) => {
  const [clicked, setClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const [opened, { toggle }] = useDisclosure(false);

  const handleClick = () => {
    toggle();
  };

  const handleNew = (event: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    const targetClassList = event.currentTarget.classList; // Get the clicked button's class

    if (targetClassList.contains("new-note-button")) {
      console.log("New Note button clicked");
      setSelectedItem("newNote");
    } else if (targetClassList.contains("new-task-button")) {
      console.log("New Task button clicked");
      setSelectedItem("newTask");
    }
  };

  useEffect(() => {
    console.log("FloatingContainer received: ", { clicked, selectedItem });
  }, [clicked, selectedItem]);

  return (
    <Box className="create-new-box">
      <Container
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          width: "100%",
        }}
        m={0}
        size={"lg"}
        p={20}
        className="create-new-container"
      >
        <Group justify="center" mb={20} className="add-extra-button-group">
          <Button
            onClick={() => handleClick()}
            size="lg"
            variant="light"
            color="#000"
            className="create-new-button"
          >
            <Flex
              className="button-inner"
              align={Center}
              gap={10}
              justify={Center}
            >
              <IconPlus size={20} stroke={1.5} />
              <p className="button-text">Create New</p>
            </Flex>
          </Button>
        </Group>
        <Collapse in={opened}>
          <Group className="create-new-collapse">
            <Button
              variant="filled"
              color="#000"
              size="md"
              className="extra-button new-task-button"
              onClick={handleNew}
            >
              <div className="button-inner">
                <div
                  className="icon-plus-container"
                  style={{ display: "flex" }}
                >
                  <IconSquarePlus size={20} stroke={1.5} />
                </div>
                <p>New Task</p>
              </div>
            </Button>
            <Button
              variant="filled"
              color="#000"
              size="md"
              className="extra-button new-note-button"
              onClick={handleNew}
            >
              <div className="button-inner">
                <div
                  className="icon-plus-container"
                  style={{ display: "flex" }}
                >
                  <IconNote size={20} stroke={1.5} />
                </div>
                <p>New Note</p>
              </div>
            </Button>
            {/* <Button
              variant="filled"
              color="#8f9562"
              size="md"
              className="extra-button new-event-button"
              onClick={handleNew}
            >
              <div className="button-inner">
                <div
                  className="icon-plus-container"
                  style={{ display: "flex" }}
                >
                  <IconCalendarPlus size={20} stroke={1.5} />
                </div>

                <p>New Event</p>
              </div>
            </Button> */}
          </Group>
        </Collapse>
      </Container>
      {clicked && (
        <div className="for-floating">
          <FloatingContainer
            setTaskAdded={setTaskAdded}
            taskAdded={taskAdded}
            clicked={clicked}
            setClicked={setClicked}
            selectedItem={selectedItem} // Pass the selected item to FloatingContainer
          />
        </div>
      )}
    </Box>
  );
};
