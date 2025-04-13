import { configureStore } from "@reduxjs/toolkit";
import todoReducer from "./Components/Slices/TodoSlice";
import noteReducer from "./Components/Slices/NoteSlice";

export const store = configureStore({
  reducer: {
    todo: todoReducer,
    note: noteReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
