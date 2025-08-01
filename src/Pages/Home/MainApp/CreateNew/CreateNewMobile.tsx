import { Button } from "@/components/ui/button";
import { handleNew } from "./AddNew/Functions";
import { CreateNewMobileProps } from "@/Interface/Types";

export const CreateNewMobile = ({
  setSelectedItem,
  setClicked,
}: CreateNewMobileProps) => {
  return (
    <div className="flex flex-col items-center justify-center w-auto h-auto absolute z-[100]">
      <div className="flex flex-col items-start gap-3">
        <Button
          className="new-task-button"
          onClick={(e) => handleNew({ setSelectedItem, setClicked, event: e })}
        >
          New Task
        </Button>
        <Button
          className="new-note-button w-full"
          onClick={(e) => handleNew({ setSelectedItem, setClicked, event: e })}
        >
          New Note
        </Button>
      </div>
    </div>
  );
};
