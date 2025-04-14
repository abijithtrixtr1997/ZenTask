import { Flex, TextInput } from "@mantine/core";
import "draft-js/dist/Draft.css";
import "./instantNote.css";
import { useState } from "react";
import { FloatingContainer } from "../AddNew/AddFloating";

export const InstantNote = () => {
  const [clicked, setClicked] = useState<boolean>(false);
  const [clickedForNewNote, setClickedForNewNote] = useState<boolean>(false);
  const selectedItem = "newNote";

  const handleNewNote = () => {
    setClicked(true);
    setClickedForNewNote(true);
  };

  return (
    <Flex className="instant-note" p={20}>
      <div className="note-arrow-group">
        <TextInput
          className="instant-title"
          size="xs"
          placeholder="Click to Add New Note..."
          onClick={() => handleNewNote()}
          readOnly
        />
      </div>
      {clicked && (
        <div className="for-floating">
          <FloatingContainer
            clickedForNewNote={clickedForNewNote}
            setClickedForNewNote={setClickedForNewNote}
            clicked={clicked}
            setClicked={setClicked}
            selectedItem={selectedItem} // Pass the selected item to FloatingContainer
          />
        </div>
      )}
    </Flex>
  );
};
