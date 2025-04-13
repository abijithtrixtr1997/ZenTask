import { useEffect, useRef } from "react";
// import { AddEvent } from "./AddEvent";
import { AddNote } from "./AddNote";
import { AddTask } from "./AddTask";
import { IconX } from "@tabler/icons-react";

interface FloatingContainerProps {
  setTaskAdded: (taskAdded: boolean) => void;
  taskAdded: boolean; // Function to notify the parent that task was added
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
  selectedItem: string | null;
  clickedForNewNote: boolean;
  setClickedForNewNote: (value: boolean) => void;
}

export const FloatingContainer = ({
  setTaskAdded,
  taskAdded,
  clicked,
  setClicked,
  selectedItem,
  clickedForNewNote,
  setClickedForNewNote,
}: FloatingContainerProps) => {
  const floatref = useRef<HTMLDivElement | null>(null);

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
        console.log("Clicked outside");
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
        console.log("Rendering AddTask component");
        return (
          <AddTask
            setTaskAdded={setTaskAdded}
            taskAdded={taskAdded}
            clicked={clicked}
            setClicked={setClicked}
          />
        );
      case "newNote":
        return (
          <AddNote
            taskAdded={taskAdded}
            setTaskAdded={setTaskAdded}
            clicked={clicked}
            setClicked={setClicked}
            clickedForNewNote={clickedForNewNote}
            setClickedForNewNote={setClickedForNewNote}
          />
        );
      // case "newEvent":
      //   return (
      //     <AddEvent
      //       setTaskAdded={setTaskAdded}
      //       taskAdded={taskAdded}
      //       clicked={clicked}
      //       setClicked={setClicked}
      //     />
      //   );
      default:
        return null;
    }
  };

  return (
    <>
      {clicked && (
        <div className="outer-task-input">
          <div className="task-input-container" ref={floatref}>
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
