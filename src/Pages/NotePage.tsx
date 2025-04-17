import { User } from "@supabase/supabase-js";
import { NoteList } from "../Components/NoteList/NoteList";
import { Flex } from "@mantine/core";
import { InstantNote } from "../Components/InstantNote/InstantNote";
import { useEffect } from "react";
import { supabase } from "../supabaseClient";
import { setNotes } from "../Components/Slices/NoteSlice";
import { useDispatch } from "react-redux";

interface NotePageProps {
  user: User;
}

export const NotePage = ({ user }: NotePageProps) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchNotes = async () => {
      console.log("fetching notes");
      const { data, error } = await supabase
        .from("Notes")
        .select()
        .eq("uuid", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching notes:", error);
        return;
      }

      dispatch(setNotes(data));
    };

    fetchNotes();
  }, [user]);

  return (
    <Flex className="note-page" p={20} pb={20} mb={20}>
      <InstantNote />
      <NoteList />
    </Flex>
  );
};
