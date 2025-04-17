import { Box, Button, Container, Group } from "@mantine/core";
import {
  // IconCalendarPlus,
  IconNote,
  IconSquarePlus,
} from "@tabler/icons-react";
import { useState } from "react";
import { FloatingContainer } from "./AddNew/AddFloating";
import { Note } from "../types";

export const CreateNew = () => {
  const note = {} as Note;
  const [clicked, setClicked] = useState(false);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);

  const handleNew = (event: React.MouseEvent<HTMLButtonElement>) => {
    setClicked(true);
    const targetClassList = event.currentTarget.classList; // Get the clicked button's class

    if (targetClassList.contains("new-note-button")) {
      setSelectedItem("newNote");
    } else if (targetClassList.contains("new-task-button")) {
      setSelectedItem("newTask");
    }
  };

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
        <Group className="create-new-collapse">
          <Button
            variant="filled"
            size="md"
            className="extra-button new-task-button"
            onClick={handleNew}
          >
            <div className="button-inner">
              <div className="icon-plus-container" style={{ display: "flex" }}>
                <IconSquarePlus size={20} stroke={1.5} />
              </div>
              <p>New Task</p>
            </div>
          </Button>
          <Button
            variant="filled"
            size="md"
            className="extra-button new-note-button"
            onClick={handleNew}
          >
            <div className="button-inner">
              <div className="icon-plus-container" style={{ display: "flex" }}>
                <IconNote size={20} stroke={1.5} />
              </div>
              <p>New Note</p>
            </div>
          </Button>
        </Group>
      </Container>
      {clicked && (
        <div className="for-floating">
          <FloatingContainer
            clicked={clicked}
            setClicked={setClicked}
            note={note}
            selectedItem={selectedItem}
          />
        </div>
      )}
    </Box>
  );
};
