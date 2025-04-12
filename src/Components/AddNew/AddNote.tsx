import { useEffect, useState, useRef } from "react";
import { Container, Button, Flex, TextInput } from "@mantine/core"; // Import Bootstrap components
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { IconDeviceFloppy } from "@tabler/icons-react";
import { supabase } from "../../supabaseClient"; // Import Supabase client
import { User } from "@supabase/supabase-js";

interface AddNoteProps {
  setTaskAdded: (taskAdded: boolean) => void;
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
}

export const AddNote = ({
  setTaskAdded,
  clicked,
  setClicked,
}: AddNoteProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [user, setUser] = useState<User | null>(null); // State to hold user data
  const [quill, setQuill] = useState<Quill | null>(null); // State to hold the Quill instance
  const [title, setTitle] = useState<string>(""); // State to hold the note title

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
      const plainText = quill.getText(); // Get plain text content
      const editorElement = quill.root;

      console.log("Note content:", noteContent);
      console.log("Plain text content:", plainText); // Log plain text content
      if (plainText.trim() === "" || noteContent.trim() === "") {
        console.log("if clause works");
        editorElement.classList.add("empty-note");
        return;
      }
      console.log("About to save note to Supabase");
      try {
        const { data, error } = await supabase.from("Notes").insert([
          {
            uuid: user?.id,
            Content: noteContent,
          },
        ]);

        if (error) {
          console.error("Error saving note:", error); // Handle error
        } else {
          console.log("Note saved successfully:", data);
        }
      } catch (error) {
        console.error("Error saving note:", error);
      }
      editorElement.classList.remove("empty-note");
      setTaskAdded(true);
      setClicked(false);
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
