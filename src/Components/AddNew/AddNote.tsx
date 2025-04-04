import { useEffect, useState, useRef } from "react";
import { Container, Button, Flex } from "@mantine/core"; // Import Bootstrap components
import Quill from "quill";
import "quill/dist/quill.snow.css"; // Import Quill styles
import { IconDeviceFloppy } from "@tabler/icons-react";

interface AddNoteProps {
  setTaskAdded: (taskAdded: boolean) => void;
  taskAdded: boolean; // Function to notify the parent that task was added
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
}

export const AddNote = ({
  setTaskAdded,
  taskAdded,
  clicked,
  setClicked,
}: AddNoteProps) => {
  const editorRef = useRef<HTMLDivElement | null>(null);
  const [quill, setQuill] = useState<Quill | null>(null); // State to hold the Quill instance

  useEffect(() => {
    if (!quill && editorRef.current) {
      const quillInstance = new Quill(editorRef.current, {
        theme: "snow",
        placeholder: "Write your note here...",
        modules: {
          toolbar: [
            ["bold", "italic", "underline"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
          ],
        },
      });
      setQuill(quillInstance);
    }
  }, []);

  const handleSave = () => {
    if (quill) {
      const noteContent = quill.root.innerHTML;
      console.log("Note content:", noteContent);
      setTaskAdded(true);
      setClicked(false);
      console.log(taskAdded);
    }
  };

  return (
    clicked && (
      <Container className="note-container" p={10}>
        <Container className="editor" ref={editorRef} />
        <Button
          className="save-note-button"
          onClick={handleSave}
          size="xs"
          p={10}
          h={40}
          variant="filled"
        >
          <Flex justify="center" align="center">
            <IconDeviceFloppy size={16} stroke={1.5} />
            <p>Save Note</p>
          </Flex>
        </Button>
      </Container>
    )
  );
};
