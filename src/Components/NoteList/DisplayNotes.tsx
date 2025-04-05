import { Container, Text } from "@mantine/core";
import DOMPurify from "dompurify";

interface Note {
  id: string;
  Content: string;
  created_at: string;
  uuid: string;
}

interface DisplayNote {
  note: Note;
}

export const DisplayNotes = ({ note }: DisplayNote) => {
  return (
    <Container className="display-note" mb={10}>
      <Container className="note-container" maw={400} bg={"red"} p={10}>
        <Text
          size="sm"
          className="note-display-text"
          style={{
            wordBreak: "break-word", // This ensures long words break to the next line
            overflowWrap: "break-word",
          }}
          mb={5}
          maw={400}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(note?.Content || ""),
          }}
        />
      </Container>
    </Container>
  );
};
