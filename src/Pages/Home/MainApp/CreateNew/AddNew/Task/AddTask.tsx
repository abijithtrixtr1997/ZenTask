import { IconSquareRoundedPlusFilled } from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { User } from "@supabase/supabase-js";
import { useDispatch } from "react-redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { taskSchema } from "./taskSchema";
import { AppDispatch } from "@/Store";
import { supabase } from "@/supabaseClient";
import { insertTasks } from "@/Slices/TodoSlice";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DateTimePicker } from "./Functions/DateTime";
import { AddTaskProps, Task } from "@/Interface/Types";
import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { TagSelector } from "./Functions/TagSelector";
import { PrioritySelector } from "./Functions/PrioritySelector";

export const AddTask = ({
  clicked,
  setClicked,
  dateRef,
  selectingDate,
  setSelectingDate,
  ddmRef,
  task,
}: AddTaskProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const [user, setUser] = useState<User | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");
  const [tags, setTags] = useState<string[]>(
    task?.Tags
      ? String(task.Tags)
          .split(",")
          .map((tag) => tag.trim())
      : []
  );
  const [Priority, setPriority] = useState<string>(
    task?.Priority || "Priority"
  );
  const [priorityBg, setPriorityBg] = useState<string>("bg-background");

  useEffect(() => {
    Priority === "High"
      ? setPriorityBg("bg-red-400")
      : Priority === "Medium"
      ? setPriorityBg("bg-orange-300")
      : Priority === "Low"
      ? setPriorityBg("bg-yellow-200")
      : null;
  }, [Priority]);

  const form = useForm<z.infer<typeof taskSchema>>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      Title: task?.Title || "",
      description: task?.description || "",
      Due: task?.Due || "",
      id: task?.id || "",
      uid: "",
      completed: task?.completed || false,
      created_at: task?.created_at || new Date().toISOString(),
    },
  });

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) throw error;
      setUser(data?.user);
      return data.user;
    };
    getUser();
  }, []);

  const onSubmit = async (data: z.infer<typeof taskSchema>) => {
    if (user) {
      try {
        const newTask: Task = {
          id: crypto.randomUUID(),
          uid: user.id,
          Title: data.Title,
          description: data.description || "",
          completed: false,
          created_at: new Date().toISOString(),
          Due: formattedTime || null,
          Gemini_ID: null,
          Tags: tags,
          Priority: Priority === "Priority" ? "None" : Priority,
        };

        dispatch(insertTasks(newTask));
        setClicked(false);
      } catch (err: unknown) {}
    }
  };

  useEffect(() => {
    if (selectedTime) {
      const formatted = new Date(selectedTime).toISOString(); // ISO string format
      setFormattedTime(formatted);
    }
  }, [selectedTime]);

  const {
    formState: { errors },
  } = form;

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    clicked && (
      <div className="task-inputflex flex-col items-center justify-center gap-10 w-full h-full ">
        <h1 className="unset add-task-title capitalize w-full text-center pt-10 sm:pt-5 py-5 font-semibold mb-5 text-[var(--text-color)] !text-2xl border-b-1">
          Add new task
        </h1>
        <FormProvider {...form}>
          <form
            className="submit-form p-5 h-full sm:max-h-[400px] w-full gap-2 flex flex-col "
            onSubmit={form.handleSubmit(onSubmit)}
          >
            <FormField
              control={form.control}
              name="Title"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Input
                      className="task-text ml-0 text-[var(--text-color)] placeholder:text-md placeholder:text-primary"
                      placeholder="Enter Task..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Textarea
                      className="task-textarea resize-none w-full h-full p-2 placeholder:text-xs text-[var(--text-color)]"
                      placeholder="Add Description..."
                      {...field}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="mt-3 py-5 sm:p-2 flex flex-col sm:gap-2 justify-start items-start relative gap-5">
              <div
                className="flex gap-2 justify-between items-center w-full !relative"
                onClick={() => setSelectingDate(!selectingDate)}
              >
                <div className="date-time">
                  <DateTimePicker
                    setSelectedTime={setSelectedTime}
                    dateRef={dateRef}
                    selectedTime={task?.Due}
                  />
                </div>
                <div
                  className="tags flex-1 flex items-center justify-end"
                  ref={ddmRef}
                >
                  <TagSelector tags={tags} setTags={setTags} />
                </div>
              </div>
              <PrioritySelector
                Priority={Priority}
                setPriority={setPriority}
                priorityBg={priorityBg}
              />
            </div>
            <div className="submit-container items-center justify-end gap-2 mt-2 flex">
              <Button className="task-add-button rounded-md" type="submit">
                <IconSquareRoundedPlusFilled
                  className="add-icon"
                  size={25}
                  stroke={1.5}
                />
                {task ? (
                  <p className="add-task-text">Update Task </p>
                ) : (
                  <p className="add-task-text">Add Task </p>
                )}
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    )
  );
};
