import { useEffect, useRef } from "react";
import { AddNote } from "./AddNote";
import { AddTask } from "./AddTask";
import { IconX } from "@tabler/icons-react";
import { Note } from "../../types";

interface FloatingContainerProps {
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  selectedItem: string | null;
  note?: Note;
  content?: string;
}

export const FloatingContainer = ({
  clicked,
  setClicked,
  selectedItem,
  note,
  content,
}: FloatingContainerProps) => {
  const floatref = useRef<HTMLDivElement | null>(null);
  // const [color, setColor] = useState("#ffffff");

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape" && clicked) {
        setClicked(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [clicked, setClicked]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clicked &&
        floatref.current &&
        !floatref.current.contains(event.target as Node)
      ) {
        setClicked(false); // Close the container if clicking outside
      }
    };

    // Delay adding event listener to prevent immediate closing
    const timer = setTimeout(() => {
      document.addEventListener("click", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleClickOutside);
    };
  }, [clicked, setClicked]);

  const renderComponent = () => {
    switch (selectedItem) {
      case "newTask":
        return <AddTask clicked={clicked} setClicked={setClicked} />;
      case "newNote":
        return (
          <AddNote
            note={note}
            clicked={clicked}
            setClicked={setClicked}
            content={content}
          />
        );
      default:
        return null;
    }
  };

  return (
    <>
      {clicked && (
        <div className="complete-floating">
          <div
            className="test-page"
            style={{
              // backgroundColor: color,
              padding: "1rem",
              borderRadius: "8px",
            }}
            ref={floatref}
          >
            <button
              onClick={() => setClicked(false)}
              className="close-button"
              style={{ zIndex: 1000 }}
            >
              <IconX size={20} />
            </button>
            {renderComponent()}
          </div>
        </div>
      )}
    </>
  );
};
