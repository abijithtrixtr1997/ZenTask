import { User } from "@supabase/supabase-js";
import { supabase } from "../../supabaseClient";
import { useState, useEffect } from "react";
import { DisplayNotes } from "./DisplayNotes";

interface Note {
  id: string;
  Content: string;
  created_at: string;
  uuid: string;
}

interface NoteListProps {
  user: User;
  taskAdded: boolean;
}

export const NoteList = ({ user, taskAdded }: NoteListProps) => {
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
  }, [taskAdded, user]); // Re-fetch when `user` changes

  useEffect(() => {
    console.log("Notes after update:", notes);
  }, [notes]);

  return (
    <div style={{ marginTop: "2rem" }} className="note-whole-list">
      <h1 style={{ marginBottom: "1rem" }}>Notes</h1>
      {notes.length > 0 ? (
        notes.map((note) => <DisplayNotes key={note?.id} note={note} />)
      ) : (
        <li>No notes found</li>
      )}
    </div>
  );
};
