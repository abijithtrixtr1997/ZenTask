import { deleteNoteInDB } from "../Slices/NoteSlice";

export const deleteNoteFunction = async (
  id: `${string}-${string}-${string}-${string}-${string}`,
  dispatch: any,
  setNoteUpdated: (value: boolean) => void,
  noteUpdated: boolean
) => {
  try {
    // Dispatch delete action to update Redux state
    const result = await dispatch(deleteNoteInDB(id));

    if (result.error) {
      console.error("Error deleting task:", result.error.message);
    } else {
      setNoteUpdated(!noteUpdated);
    }
  } catch (error) {
    console.error("Failed to delete task:", error);
  }
};
