import { Container, Text, Title } from "@mantine/core";
import {
  IconPaletteFilled,
  IconPencil,
  IconPinFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteNoteFunction } from "./DeleteNote";
import { Note } from "../../types";
import "../Styles/Notes.css";

interface DisplayNote {
  note: Note;
  noteUpdated: boolean;
  setNoteUpdated: (value: boolean) => void;
}

export const DisplayNotes = ({
  note,
  noteUpdated,
  setNoteUpdated,
}: DisplayNote) => {
  const dispatch = useDispatch();
  const [noteToDisplay, setNoteToDisplay] = useState<Note | null>(null);
  useEffect(() => {
    setNoteToDisplay(note);
    const noteWithImage = note.Content.includes("<img") ? note : "";

    if (noteWithImage) {
      const numberOfImages = (note.Content.match(/<img\b[^>]*>/g) || []).length;
      const pTagContents = noteWithImage.Content.split(/<\/?p>/gi)
        .map((part) => part.trim())
        .filter((part) => part !== "");
      if (pTagContents.length > 1) {
        const otherParts = pTagContents.filter(
          (part) => part.trim() !== "<br>" && part.trim() !== ""
        );

        if (otherParts.length === numberOfImages) {
          const imagesOnlyHTML = otherParts
            .map((part) => `<p>${part}</p>`)
            .join("");
          setNoteToDisplay({ ...note, Content: imagesOnlyHTML });
        }
      }
    }
  }, []);

  const handleDelete = () => {
    deleteNoteFunction(note.id, dispatch, setNoteUpdated, noteUpdated);
  };

  return (
    <Container className="display-note" mb={10} p={10} maw={400}>
      <Title order={3} ta={"center"}>
        {noteToDisplay?.Title}
      </Title>
      <Text
        size="sm"
        ta={"left"}
        className="note-display-text"
        style={{
          wordBreak: "break-word", // This ensures long words break to the next line
          overflowWrap: "break-word",
        }}
        mb={20}
        maw={400}
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(noteToDisplay?.Content || ""),
        }}
      />
      <div className="bottom-toolbar">
        <button className="manipulate-button color-note-button">
          <IconPaletteFilled size={14} />
        </button>
        <button className="manipulate-button pin-note-button">
          <IconPinFilled size={14} />
        </button>
        <button className="manipulate-button edit-note-button">
          <IconPencil size={14} />
        </button>
        <button
          className="manipulate-button delete-note-button"
          onClick={handleDelete}
        >
          <IconTrashFilled size={14} />
        </button>
      </div>
    </Container>
  );
};
