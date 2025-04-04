interface AddEventProps {
  setTaskAdded: (taskAdded: boolean) => void;
  taskAdded: boolean; // Function to notify the parent that task was added
  clicked: boolean; // Function to notify the parent that task was added
  setClicked: (clicked: boolean) => void;
}

export const AddEvent = ({
  setTaskAdded,
  taskAdded,
  clicked,
  setClicked,
}: AddEventProps) => {
  console.log(clicked);
  console.log(taskAdded);
  console.log("Clicked:", setTaskAdded);
  console.log(setClicked);
  return clicked && <div>AddEvent</div>;
};
