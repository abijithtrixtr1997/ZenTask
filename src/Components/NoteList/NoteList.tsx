import { useEffect, useState } from "react";
import { DisplayNotes } from "./DisplayNotes";
import { Flex } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { Note } from "../../types";

export const NoteList = () => {
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const noteList = useSelector((state: RootState) => state.note.notes);

  useEffect(() => {
    console.log("noteList has changed");
    setLocalNotes(noteList);
  }, [noteList]);

  return (
    <Flex
      className="note-whole-list"
      direction="column"
      align="flex-start"
      p={20}
    >
      <h1 style={{ marginBottom: "1rem" }}>Notes</h1>
      <div className="all-notes">
        {localNotes.length > 0 ? (
          localNotes.map((note) => (
            <>
              <DisplayNotes
                key={note.id}
                note={note}
                content={note.Content}
                image={note.Image}
              />
            </>
          ))
        ) : (
          <li>No notes found</li>
        )}
      </div>
    </Flex>
  );
};
