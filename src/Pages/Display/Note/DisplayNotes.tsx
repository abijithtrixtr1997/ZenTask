import {
  IconCircleX,
  IconPaletteFilled,
  IconPencil,
  IconPinFilled,
  IconTrashFilled,
} from "@tabler/icons-react";
import DOMPurify from "dompurify";
import { useState, useRef, useEffect } from "react";
import { useDispatch } from "react-redux";
import { deleteNoteFunction, pinNoteFunction } from "./NoteFunctions";
import { FloatingContainer } from "@/Pages/Home/MainApp/CreateNew/Floating";
import { cn } from "@/lib/utils";
import { updateNoteInDB } from "@/Slices/NoteSlice";
import { AppDispatch } from "@/Store";
import { DisplayNote } from "@/Interface/Types";

export const DisplayNotes = ({ note, content, image }: DisplayNote) => {
  const dispatch = useDispatch<AppDispatch>();
  const [changingColor, setChangingColor] = useState(false);
  const [color, setColor] = useState<string>(note?.color ?? "bg-background");
  const [fontColor, setFontColor] = useState("text-primary");
  const [isEditing, setIsEditing] = useState(false);
  const [dbColor, setDBColor] = useState(note?.color ?? "background");
  const selectedItem = "newNote";
  const bottomToolbar = useRef<HTMLDivElement | null>(null);
  const editButton = useRef<HTMLButtonElement | null>(null);
  const noteRef = useRef<HTMLDivElement | null>(null);
  const [colorChanged, setColorChanged] = useState(false);
  useEffect(() => {
    switch (note?.color) {
      case "red":
        setColor("bg-red-400");
        setFontColor("text-black");
        break;
      case "blue":
        setColor("bg-blue-500");
        setFontColor("text-slate-800");
        break;
      case "green":
        setColor("bg-green-700");
        break;
      case "yellow":
        setColor("bg-yellow-300");
        break;
      default:
        break;
    }
  }, [note?.color]);

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

  useEffect(() => {
    const handleMouseLeave = () => {
      setChangingColor(false);
    };

    const noteElement = noteRef.current;
    if (noteElement) {
      noteElement.addEventListener("mouseleave", handleMouseLeave);
    }

    // Clean up the event when the component unmounts
    return () => {
      if (noteElement) {
        noteElement.removeEventListener("mouseleave", handleMouseLeave);
      }
    };
  }, []);

  const handleColor = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (bottomToolbar) {
      setChangingColor(!changingColor);
    }
  };

  const updateNote = async () => {
    if (!note) return; // safer check
    const updates = {
      color: dbColor,
    };
    try {
      console.log("in try block");
      const result = await dispatch(
        updateNoteInDB({ id: note.id, updates })
      ).unwrap();
      console.log("Note updated successfully:", result);
    } catch (error) {
      console.error("Failed to update note:", error);
    }
  };

  const changeColor = (
    e: React.MouseEvent<HTMLButtonElement>,
    color: string
  ) => {
    e.stopPropagation();
    console.log("Changing color to:", color);
    setChangingColor(!changingColor);
    if (color === note?.color) {
      console.log("Color is the same, not changing");
      return;
    }
    setColorChanged(true);
    switch (color) {
      case "red":
        setColor("bg-red-400");
        setFontColor("text-black");
        setDBColor("red");
        break;
      case "blue":
        setColor("bg-blue-500");
        setFontColor("text-slate-800");
        setDBColor("blue");
        break;
      case "green":
        setColor("bg-green-700");
        setDBColor("green");
        break;
      case "yellow":
        setColor("bg-yellow-300");
        setDBColor("yellow");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (colorChanged) {
      console.log("Color changed, updating note");
      updateNote();
      setColorChanged(false);
    }
  }, [colorChanged]);

  return (
    <>
      <div
        className={cn(
          "display-note mb-2 p-2  max-w-[180px] sm:max-w-[400px] relative pb-6 break-inside-avoid flex flex-col hover:scale-101 hover:shadow-lg sm:justify-start sm:items-start w-[300px] h-auto rounded-lg shadow-md duration-300 ease-in-out transition-shadow will-change-transform cursor-pointer",
          color,
          fontColor
        )}
        onClick={handleEdit}
        ref={noteRef}
      >
        <div className="image-note-display flex justify-center items-center w-full h-full">
          {image && <img className="w-full h-full" src={image}></img>}
        </div>

        <h1 className="note-display-title text-center !text-lg font-bold">
          {note?.Title}
        </h1>
        <p
          className="note-display-text text-xs text-left break-words mb-4 max-w-[400px]"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(content),
          }}
        ></p>
        {!changingColor ? (
          <div
            className="bottom-toolbar text-primary opacity-0 absolute w-full mb-2 h-8 bottom-0 left-0 rounded-b-lg flex fill-primary items-center justify-between p-2 gap-2 transition-opacity duration-300 ease-in-out"
            ref={bottomToolbar}
          >
            <button
              className="manipulate-button color-note-button hover:shadow-sm !rounded-full !p-2 hover:bg-black/10 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={handleColor}
            >
              <IconPaletteFilled size={14} className="all-unset" />
            </button>

            <button
              className="manipulate-button pin-note-button hover:shadow-sm hover:bg-black/10 !rounded-full !p-2 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={handlePin}
            >
              <IconPinFilled size={14} className="all-unset" />
            </button>
            <button
              ref={editButton}
              className="manipulate-button edit-note-button hover:shadow-sm hover:bg-black/10 !rounded-full !p-2 hover:scale-105 transition-all duration-300 ease-in-out"
              onClick={handleEdit}
            >
              <IconPencil size={14} className="all-unset" />
            </button>
            <button
              className="manipulate-button delete-note-button hover:shadow-sm hover:bg-black/10 !rounded-full !p-2 transition-all duration-300 ease-in-out hover:scale-105"
              onClick={handleDelete}
            >
              <IconTrashFilled size={14} className="all-unset" />
            </button>
          </div>
        ) : (
          <div className="color-toolbar text-primary opacity-100 absolute w-full mb-2 h-8 bottom-0 left-0 rounded-b-lg flex fill-primary items-center justify-between p-2 gap-2 transition-opacity duration-300 ease-in-out">
            <button
              className="bg-secondary-300 !rounded-full !p-1 ml-1 border border-secondary"
              onClick={() => setChangingColor(false)}
            >
              <IconCircleX />
            </button>
            <button
              className="bg-green-300 !rounded-full !p-2 border border-secondary"
              onClick={(e) => changeColor(e, "green")}
            ></button>
            <button
              className="bg-red-300 !rounded-full !p-2 border border-secondary"
              onClick={(e) => changeColor(e, "red")}
            ></button>
            <button
              className="bg-blue-300 !rounded-full !p-2 border border-secondary"
              onClick={(e) => changeColor(e, "blue")}
            ></button>
            <button
              className="bg-yellow-300 !rounded-full !p-2 mr-1 border border-secondary"
              onClick={(e) => changeColor(e, "yellow")}
            ></button>
          </div>
        )}
      </div>
      {isEditing && note && (
        <div className="for-floating">
          <FloatingContainer
            clicked={isEditing}
            setClicked={setIsEditing}
            selectedItem={selectedItem}
            note={note}
          />
        </div>
      )}
    </>
  );
};
