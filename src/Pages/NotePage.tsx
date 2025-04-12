import { User } from "@supabase/supabase-js";
import { NoteList } from "../Components/NoteList/NoteList";
import { Flex } from "@mantine/core";
import { InstantNote } from "../Components/InstantNote/InstantNote";

interface NotePageProps {
  user: User;
}

export const NotePage = ({ user }: NotePageProps) => {
  return (
    <Flex
      direction={"column"}
      align={"center"}
      justify={"center"}
      w={"100%"}
      h={"100%"}
      className="note-page"
      p={20}
    >
      <InstantNote />
      <NoteList user={user} />
    </Flex>
  );
};
