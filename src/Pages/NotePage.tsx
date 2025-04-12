import { User } from "@supabase/supabase-js";
import { NoteList } from "../Components/NoteList/NoteList";
import { Flex } from "@mantine/core";
import { InstantNote } from "../Components/InstantNote/InstantNote";
import { useState } from "react";

interface NotePageProps {
  user: User;
}

export const NotePage = ({ user }: NotePageProps) => {
  const [noteAdded, setNoteAdded] = useState<boolean>(false);

  return (
    <Flex className="note-page" p={20}>
      <InstantNote noteAdded={noteAdded} setNoteAdded={setNoteAdded} />
      <NoteList user={user} noteAdded={noteAdded} />
    </Flex>
  );
};
