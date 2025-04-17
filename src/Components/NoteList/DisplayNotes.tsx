import { Container, Text, Title } from "@mantine/core";
import {
  IconPaletteFilled,
  IconPencil,
  IconPinFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import { useState, useRef } from "react";
import { useDispatch } from "react-redux";
import { deleteNoteFunction, pinNoteFunction } from "./NoteFunctions";
import { Note } from "../../types";
import "./Notes.css";
import { FloatingContainer } from "../AddNew/AddFloating";

interface DisplayNote {
  note: Note;
  content: string;
  image?: string | null;
}

export const DisplayNotes = ({ note, content, image }: DisplayNote) => {
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const selectedItem = "newNote";
  const bottomToolbar = useRef<HTMLDivElement | null>(null);
  const editButton = useRef<HTMLButtonElement | null>(null);

  const handleEdit = (e: React.MouseEvent) => {
    if (bottomToolbar.current?.contains(e.target as Node)) {
      if (editButton.current?.contains(e.target as Node)) {
        setIsEditing(true);
        return;
      }
      return;
    }
    setIsEditing(true);
  };

  const handleDelete = () => {
    deleteNoteFunction(note.id, dispatch);
  };

  const handlePin = () => {
    console.log("Pin clicked");
    console.log(note);
    pinNoteFunction(note.id, dispatch, !note.Pinned);
  };

  return (
    <>
      <Container
        className="display-note"
        mb={10}
        p={10}
        maw={400}
        onClick={handleEdit}
      >
        <div className="image-note-display">
          {image && <img src={image}></img>}
        </div>

        <Title order={5} ta={"center"} className="note-display-title">
          {note?.Title} {note?.Pinned}
        </Title>
        <Text
          size="xs"
          ta={"left"}
          className="note-display-text"
          style={{
            wordBreak: "break-word", // This ensures long words break to the next line
            overflowWrap: "break-word",
          }}
          mb={20}
          maw={400}
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content || ""),
          }}
        />
        <div className="bottom-toolbar" ref={bottomToolbar}>
          <button className="manipulate-button color-note-button">
            <IconPaletteFilled size={14} />
          </button>
          <button
            className="manipulate-button pin-note-button"
            onClick={handlePin}
          >
            <IconPinFilled size={14} />
          </button>
          <button
            ref={editButton}
            className="manipulate-button edit-note-button"
            onClick={handleEdit}
          >
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
      {isEditing && note && (
        <div className="for-floating">
          <FloatingContainer
            clicked={isEditing}
            setClicked={setIsEditing}
            selectedItem={selectedItem}
            note={note}
            content={content}
          />
        </div>
      )}
    </>
  );
};
