import { deleteTaskInDB } from "../Slices/TodoSlice";

export const deleteTask = async (
  id: `${string}-${string}-${string}-${string}-${string}`,
  dispatch: any,
  setTaskDeleted: (value: boolean) => void,
  taskDeleted: boolean
) => {
  try {
    // Dispatch the delete action
    const result = await dispatch(deleteTaskInDB(id));

    if (result.error) {
      console.error("Error deleting task:", result.error.message);
    } else {
      console.log("Task deleted successfully");
      setTaskDeleted(!taskDeleted);
    }
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};
