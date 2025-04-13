import { User } from "@supabase/supabase-js";
import { useState, useEffect } from "react";
import { DisplayNotes } from "./DisplayNotes";
import { Flex } from "@mantine/core";
import { useSelector } from "react-redux";
import { RootState } from "../../Store";
import { Note } from "../../types";

interface NoteListProps {
  user: User;
  noteAdded: boolean;
}

export const NoteList = ({ user, noteAdded }: NoteListProps) => {
  const [noteUpdated, setNoteUpdated] = useState<boolean>(false);
  const [localNotes, setLocalNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const notes = useSelector((state: RootState) => state.note.notes);

  useEffect(() => {
    console.log("notes changed");
    setLocalNotes(notes);
    setLoading(false);
    console.log(user, noteAdded);
  }, [notes, user, noteAdded]);

  return (
    <Flex
      className="note-whole-list"
      direction="column"
      align="flex-start"
      p={20}
    >
      <h1 style={{ marginBottom: "1rem" }}>Notes</h1>

      {loading ? (
        <p>Your notes are being loaded...</p>
      ) : (
        <div className="all-notes">
          {localNotes.length > 0 ? (
            localNotes.map((note) => (
              <DisplayNotes
                key={note?.id}
                note={note}
                noteUpdated={noteUpdated}
                setNoteUpdated={setNoteUpdated}
              />
            ))
          ) : (
            <li>No notes found</li>
          )}
        </div>
      )}
    </Flex>
  );
};
