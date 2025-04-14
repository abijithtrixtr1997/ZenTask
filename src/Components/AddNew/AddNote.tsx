import { useEffect, useState, useRef } from "react";
import { Container, Button, Flex, TextInput } from "@mantine/core"; // Import Bootstrap components
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { IconDeviceFloppy } from "@tabler/icons-react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import { User } from "@supabase/supabase-js";
import { insertNoteInDB } from "../Slices/NoteSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../Store";

interface AddNoteProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  clickedForNewNote: boolean;
  setClickedForNewNote: (value: boolean) => void;
}

export const AddNote = ({
  clicked,
  setClicked,
  clickedForNewNote,
  setClickedForNewNote,
}: AddNoteProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null);
  const [title, setTitle] = useState<string>("");
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!quill && editorRef.current) {
      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your note here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            ["link", "image"],
            ["clean"],
          ],
        },
      });
      setQuill(quillInstance);
    }
  }, [quill]);

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
    if (quill) {
      const noteContent = quill.root.innerHTML;
      const plainText = quill.getText();
      const editorElement = quill.root;

      const trimContent = (htmlContent: string) => {
        if (htmlContent.includes("<img")) {
          return htmlContent;
        }

        const trimmed = htmlContent.replace(/<\/?[^>]+(>|$)/g, "");

        return trimmed.length > 3
          ? trimmed.substring(3, trimmed.length - 4).trim()
          : "";
      };

      const trimmedNoteContent = trimContent(noteContent);
      if (
        plainText.trim() === "" &&
        title === "" &&
        (trimmedNoteContent.trim() === "" ||
          trimmedNoteContent.trim() === "<br>")
      ) {
        editorElement.classList.add("empty-note");
        return;
      }
      if (user) {
        const newNote = {
          id: crypto.randomUUID(),
          uuid: user.id,
          Title: title,
          Content: noteContent,
          created_at: new Date().toISOString(),
        };

        try {
          await dispatch(insertNoteInDB(newNote));
        } catch (error) {
          console.error("Unexpected error saving note:", error);
        }

        editorElement.classList.remove("empty-note");
        setClicked(false);
        setClickedForNewNote(false);
      }
    }
  };

  return (
    clicked && (
      <Container className="note-container" p={10} pt={60}>
        <TextInput
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter your title here"
          mb={10} // margin-bottom for spacing
          w={"100%"} // full width
          className="note-title-input"
          autoFocus={clickedForNewNote}
        />
        <div className="toolbar-editor">
          <div className="editor" ref={editorRef} />
        </div>

        <Button
          className="save-note-button"
          onClick={handleSave}
          size="xs"
          p={10}
          h={40}
          variant="filled"
        >
          <Flex
            justify="center"
            align="center"
            className="save-note-button-content"
          >
            <IconDeviceFloppy size={16} stroke={1.5} />
            <p>Save Note</p>
          </Flex>
        </Button>
      </Container>
    )
  );
};
