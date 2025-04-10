import { useEffect, useRef } from "react";
import { IconX } from "@tabler/icons-react";

interface FloatingEditorProps {
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
}

export const FloatingEditor = ({
  clicked,
  setClicked,
}: FloatingEditorProps) => {
  const floatref = useRef<HTMLDivElement | null>(null);

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
          </div>
        </div>
      )}
    </>
  );
};
