import { useEffect, useState } from "react";
import { IconPalette, IconPhoto, IconPin } from "@tabler/icons-react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import { User } from "@supabase/supabase-js";
import { insertNoteInDB, updateNoteInDB } from "../Slices/NoteSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store";
import { Note } from "../../types";
import "./test.css";

interface AddNoteProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  note?: Note;
  content?: string;
}

export const AddNote = ({
  clicked,
  setClicked,
  note,
  content,
}: AddNoteProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [title, setTitle] = useState<string>(note?.Title ?? "");
  const dispatch = useDispatch<AppDispatch>();
  const [description, setDescription] = useState<string>(content ?? "");
  const [isPinned, setIsPinned] = useState(false);
  const [image, setImage] = useState<File | string | null>(note?.Image || null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("image upload clicked");
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;
      setUser(data?.user);
      return data.user;
    };
    getUser();
  }, [user]);

  const handleSave = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }

    if (!title && !description && !image) {
      console.warn("Note is empty. Skipping save.");
      return;
    }

    try {
      console.log(note ? "Updating note..." : "Saving new note...");
      let imageURL = "";

      if (image && image instanceof File) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("images")
          .upload(fileName, image);

        if (error) {
          console.error("Error uploading image:", error.message);
        } else {
          console.log(data);
          const { data: url } = supabase.storage
            .from("images")
            .getPublicUrl(fileName);
          imageURL = url.publicUrl;
        }
      }

      if (note) {
        // ✏️ Update existing note
        const noteUpdate = {
          id: note.id,
          updates: {
            Content: description,
            Title: title,
            Pinned: isPinned,
            updatedAt: new Date().toISOString(),
            Image: imageURL || note.Image || "",
          },
        };
        const result = await dispatch(updateNoteInDB(noteUpdate)).unwrap();
        console.log("Note updated:", result);
      } else {
        // 🆕 Insert new note
        const newNote: Note = {
          id: crypto.randomUUID(),
          Content: description,
          created_at: new Date().toISOString(),
          uuid: user.id,
          Title: title,
          Pinned: isPinned,
          updatedAt: new Date().toISOString(),
          Image: imageURL,
        };
        const result = await dispatch(insertNoteInDB(newNote)).unwrap();
        console.log("Note inserted:", result);
      }

      setTitle("");
      setDescription("");
      setImage(null);
      setIsPinned(false);
      setClicked(false);
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  return (
    clicked && (
      <>
        {typeof image === "string" && (
          <img
            src={image}
            alt="Existing"
            className="uploaded-image"
            style={{
              width: "100%",
              maxWidth: "500px",
              maxHeight: "300px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}

        {image instanceof File && (
          <div className="image-container">
            <img
              src={URL.createObjectURL(image)}
              className="uploaded-image"
              alt="Uploaded"
              style={{
                width: "100%",
                maxWidth: "500px",
                maxHeight: "300px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
            />
          </div>
        )}
        <div className="note-group">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="test-title"
            placeholder="Title"
          />

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="test-description"
            placeholder="Write Note"
          />
        </div>
        <div className="bottom-bar">
          <label className="color-picker bottom-button">
            <IconPalette />
          </label>

          <span
            onClick={() => setIsPinned((prev) => !prev)}
            className="pin-button bottom-button"
          >
            <IconPin />
          </span>

          <label
            style={{ cursor: "pointer" }}
            className="image-upload bottom-button"
          >
            <IconPhoto size={20} />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              style={{ display: "none" }}
            />
          </label>
        </div>
        <button className="save-button" onClick={handleSave}>
          Save
        </button>
      </>
    )
  );
};
