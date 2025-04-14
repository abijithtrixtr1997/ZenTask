import { User } from "@supabase/supabase-js";
import { NoteList } from "../Components/NoteList/NoteList";
import { Flex } from "@mantine/core";
import { InstantNote } from "../Components/InstantNote/InstantNote";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { setNotes } from "../Components/Slices/NoteSlice";
import { useDispatch } from "react-redux";

interface NotePageProps {
  user: User;
}

export const NotePage = ({ user }: NotePageProps) => {
  const dispatch = useDispatch();
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
  }, [user]);

  return (
    <Flex className="note-page" p={20}>
      <InstantNote />
      {loading ? null : <NoteList user={user} />}
    </Flex>
  );
};
