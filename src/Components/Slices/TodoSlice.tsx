import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { supabase } from "../../supabaseClient";

interface Task {
  id: `${string}-${string}-${string}-${string}-${string}`;
  uid: string | undefined;
  Title: string;
  description: string;
  completed: boolean;
  created_at: string;
}

interface TodoState {
  tasks: Task[];
}

interface TaskUpdate {
  id: string;
  updates: Partial<Omit<Task, "id">>;
}

const initialState: TodoState = {
  tasks: [],
};

const todoSlice = createSlice({
  name: "todo",
  initialState,
  reducers: {
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.push(action.payload);
    },
    setTasks: (state, action: PayloadAction<Task[]>) => {
      state.tasks = action.payload;
      supabase.from("Todo").insert(action.payload);
    },
    updateTask: (state, action: PayloadAction<TaskUpdate>) => {
      const { id, updates } = action.payload;
      const index = state.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        state.tasks[index] = { ...state.tasks[index], ...updates };
        supabase.from("Todo").update(updates).eq("id", id);
      }
    },
    deletTask: (state, action: PayloadAction<string>) => {
      state.tasks = state.tasks.filter((task) => task.id !== action.payload);
      supabase.from("Todo").delete().eq("id", action.payload);
    },
  },
});

export const { addTask, setTasks, updateTask, deletTask } = todoSlice.actions;
export default todoSlice.reducer;
