import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";

interface Note {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Content: string;
  created_at: string;
}

interface NoteState {
  notes: Note[];
}

interface NoteUpdate {
  id: string;
  updates: Partial<Omit<Note, "id">>;
}

const initialState: NoteState = {
  notes: [],
};

const noteSlice = createSlice({
  name: "note",
  initialState,
  reducers: {
    addNote: (state, action: PayloadAction<Note>) => {
      state.notes.push(action.payload);
    },
    setNotes: (state, action: PayloadAction<Note[]>) => {
      state.notes = action.payload;
      supabase.from("Notes").insert(action.payload);
    },
    updateNote: (state, action: PayloadAction<NoteUpdate>) => {
      const { id, updates } = action.payload;
      const index = state.notes.findIndex((note) => note.id === id);
      if (index !== -1) {
        state.notes[index] = { ...state.notes[index], ...updates };
        supabase.from("Notes").update(updates).eq("id", id);
      }
    },
    deleteNote: (state, action: PayloadAction<string>) => {
      state.notes = state.notes.filter((note) => note.id !== action.payload);
      supabase.from("Notes").delete().eq("id", action.payload);
    },
  },
});

export const { addNote, setNotes, updateNote, deleteNote } = noteSlice.actions;
export default noteSlice.reducer;
