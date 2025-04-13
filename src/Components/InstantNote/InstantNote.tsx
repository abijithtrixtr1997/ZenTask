import { Flex, TextInput } from "@mantine/core";
import "draft-js/dist/Draft.css";
import "./instantNote.css";
import { useState } from "react";
import { FloatingContainer } from "../AddNew/AddFloating";

interface instantNoteProps {
  noteAdded: boolean;
  setNoteAdded: (value: boolean) => void;
}

export const InstantNote = ({ noteAdded, setNoteAdded }: instantNoteProps) => {
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
            setTaskAdded={setNoteAdded}
            taskAdded={noteAdded}
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
