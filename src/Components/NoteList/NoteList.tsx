import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import { DisplayNotes } from "./DisplayNotes";
import { Flex } from "@mantine/core";

interface Note {
  id: string;
  Content: string;
  created_at: string;
  uuid: string;
}

interface NoteListProps {
  user: User;
  noteAdded: boolean;
}

export const NoteList = ({ user, noteAdded }: NoteListProps) => {
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const getNotes = async () => {
      console.log("Fetching notes for user:", user?.id);
      const { data, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", user?.id);
      console.log(typeof data);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setNotes(data); // Store all task objects instead of just 'task'
      }
    };

    getNotes();
  }, [user]); // Re-fetch when `user` changes

  useEffect(() => {
    const getNotes = async () => {
      console.log("Fetching notes for user:", user?.id);
      const { data, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", user?.id);
      console.log(typeof data);
      if (error) {
        console.error("Error fetching tasks:", error);
      } else {
        setNotes(data); // Store all task objects instead of just 'task'
      }
    };

    const timeout = setTimeout(() => {
      getNotes();
    }, 500);

    return () => clearTimeout(timeout);
  }, [noteAdded]); // Re-fetch when `user` changes

  return (
    <Flex
      className="note-whole-list"
      direction="column"
      align="flex-start"
      p={20}
    >
      <h1 style={{ marginBottom: "1rem" }}>Notes</h1>
      {notes.length > 0 ? (
        notes.map((note) => <DisplayNotes key={note?.id} note={note} />)
      ) : (
        <li>No notes found</li>
      )}
    </Flex>
  );
};
