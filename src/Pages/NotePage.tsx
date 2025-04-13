import { User } from "@supabase/supabase-js";
import { NoteList } from "../Components/NoteList/NoteList";
import { Flex } from "@mantine/core";
import { InstantNote } from "../Components/InstantNote/InstantNote";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { setNotes } from "../Components/Slices/NoteSlice";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../Store";

interface NotePageProps {
  user: User;
}

export const NotePage = ({ user }: NotePageProps) => {
  const dispatch = useDispatch();
  const notes = useSelector((state: RootState) => state.note.notes);
  const [noteAdded, setNoteAdded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const getNotes = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", user?.id);
      if (error) {
        console.error("Error fetching notes:", error);
      } else {
        dispatch(setNotes(data));
      }
      setLoading(false);
    };
    getNotes();

    console.log(notes, "note state from notepage");
  }, [noteAdded, user]);

  return (
    <Flex className="note-page" p={20}>
      <InstantNote noteAdded={noteAdded} setNoteAdded={setNoteAdded} />
      {loading ? null : <NoteList user={user} noteAdded={noteAdded} />}
    </Flex>
  );
};
