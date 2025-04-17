import { useEffect, useState } from "react";
import "./test.css";
import { supabase } from "../../supabaseClient";
import { IconPalette, IconPhoto, IconPin } from "@tabler/icons-react";
import { User } from "@supabase/supabase-js";
import { Note } from "../../types";

export const TestPage = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isPinned, setIsPinned] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [user, setUser] = useState<User | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("image upload clicked");
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error(error.message);
      } else {
        setUser(data.user);
        console.log(user);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async () => {
    if (title.length > 0 || description.length > 0 || image !== null) {
      console.log("save clicked");
      console.log(title.length);
      console.log(description.length);
      console.log(image, "image");
      let imageURL = "";
      if (image) {
        const fileName = `${Date.now()}-${image.name}`;
        const { data, error } = await supabase.storage
          .from("images") // Replace "images" with your bucket name
          .upload(fileName, image);

        if (error) {
          console.error("Error uploading image:", error.message);
        } else {
          console.log(data, "data");
          const { data: url } = await supabase.storage
            .from("images")
            .getPublicUrl(fileName);
          console.log(url, "url");
          imageURL = url.publicUrl;
        }
      }
      if (user) {
        // Create a new note object
        const newNote: Note = {
          id: crypto.randomUUID(),
          Content: description,
          created_at: new Date().toISOString(),
          uuid: user.id, // User UUID
          Title: title,
          Pinned: isPinned,
          updatedAt: new Date().toISOString(),
          Image: imageURL, // Image URL (if any)
        };

        // Insert the note into the "Notes" table in Supabase
        const { data, error } = await supabase
          .from("Notes")
          .insert([newNote])
          .select();

        if (error) {
          console.error("Error inserting note:", error.message);
        } else {
          console.log("Note saved successfully:", data);
          // Reset form after saving
          setTitle("");
          setDescription("");
          setImage(null);
          setIsPinned(false);
        }
      }
    }
  };

  return (
    <>
      {image && (
        <div className="image-container">
          <img
            src={URL.createObjectURL(image)}
            className="uploaded-image"
            alt="Uploaded"
            style={{ maxWidth: "100%" }}
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
  );
};
