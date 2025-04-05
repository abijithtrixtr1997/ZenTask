import {
  TextInput,
  Button,
  Textarea,
  Flex,
  Box,
  Collapse,
  Title,
  Container,
} from "@mantine/core";
import {
  IconClock,
  IconFileDescription,
  IconSquareRoundedPlusFilled,
} from "@tabler/icons-react";
import { useState, useEffect } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { supabase } from "../../supabaseClient";
import { User } from "@supabase/supabase-js";
import { useDisclosure } from "@mantine/hooks";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { addTask } from "../Slices/TodoSlice";
import { DateTimePicker } from "../Date_And_Time/Time";

const schema = yup.object().shape({
  title: yup.string().required("Title is required"),
  description: yup.string(),
  due: yup
    .string()
    .test("is-valid-date", "Due must be a valid date", (value) => {
      if (!value) return true;
      const parsedDate = new Date(value);
      return !isNaN(parsedDate.getTime());
    })
    .test("is-future-date", "Due must be a future date", (value) => {
      if (!value) return true;
      const parsedDate = new Date(value);
      const currentDate = new Date();
      return parsedDate > currentDate;
    })
    .transform((value) => {
      if (!value) return value;
      const dateWithTime = value.replace(
        /(\d{4}-\d{2}-\d{2}) (\d{2}:\d{2} (AM|PM))/,
        "$1T$2"
      );
      return new Date(dateWithTime);
    }),
});

interface dataToSend {
  title: string;
  description?: string;
}

interface AddTaskProps {
  setTaskAdded: (taskAdded: boolean) => void;
  taskAdded: boolean;
  clicked: boolean;
  setClicked: (clicked: boolean) => void;
}

export const AddTask = ({
  setTaskAdded,
  taskAdded,
  clicked,
  setClicked,
}: AddTaskProps) => {
  const dispatch = useDispatch();
  const [descOpened, { toggle: toggleDesc }] = useDisclosure(false);
  const [clockOpened, { toggle: toggleClock }] = useDisclosure(false);
  const [user, setUser] = useState<User | null>(null);
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [formattedTime, setFormattedTime] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
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

  const onSubmit: SubmitHandler<dataToSend> = async (data: dataToSend) => {
    console.log("in Submit");
    try {
      console.log("Submitting task to Supabase");

      const newTask = {
        id: crypto.randomUUID(),
        uid: user?.id,
        Title: data.title,
        description: data.description || "",
        completed: false,
        created_at: new Date().toISOString(),
        Due: formattedTime ? formattedTime : null,
      };

      dispatch(addTask(newTask));
      await supabase.from("Todo").insert([newTask]);

      reset();
      if (data.description) toggleDesc();

      console.log("Task added successfully");
      setClicked(false);
      setTaskAdded(!taskAdded);
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.error("Supabase Error:", err.message);
      } else {
        console.error("An unknown error occurred", err);
      }
    }
  };

  useEffect(() => {
    console.log("Time selected: ", { selectedTime });
    if (selectedTime) {
      setFormattedTime(new Date(selectedTime).toISOString());
      console.log("Formatted time: ", { formattedTime });
    }
  }, [selectedTime, formattedTime]);

  return (
    clicked && (
      <Container className="task-input" p={40} m={10}>
        <Title
          size={"xl"}
          tt={"capitalize"}
          mb={20}
          order={3}
          className="add-task-title"
          fw={700}
          w={"100%"}
          ta={"center"}
          p={10}
        >
          Add new task
        </Title>
        <form onSubmit={handleSubmit(onSubmit)} className="submit-form">
          <Box mx="auto" className="add-task-box" p={10}>
            <Flex
              mb={5}
              justify={"flex-start"}
              w={"100%"}
              align={"flex-start"}
              className="add-extra-button"
            >
              <TextInput
                ml={"0"}
                size="md"
                className="task-text"
                placeholder="Enter Task..."
                {...register("title")}
                error={errors.title?.message}
              />

              <Flex
                className="button-task-group"
                gap={10}
                align={"flex-start"}
                justify={"flex-start"}
                direction={"column"}
                w={"100%"}
                mt={10}
                h={"60%"}
              >
                <Flex
                  className="date-time"
                  h={60}
                  w={"100%"}
                  justify={"center"}
                  align={"center"}
                  p={10}
                >
                  <Flex
                    className="clock-button-container"
                    align={"center"}
                    justify={"flex-start"}
                    w={"100%"}
                    gap={"10"}
                  >
                    <Button
                      onClick={toggleClock}
                      variant="filled"
                      size="md"
                      p={"10"}
                      radius={15}
                      className="extra-button"
                    >
                      <IconClock size={20} className="add-desscription-icon" />
                      <TextInput
                        value={selectedTime}
                        display={"none"}
                      ></TextInput>
                    </Button>
                    <Collapse
                      in={clockOpened}
                      className="collapse-box"
                      w={"100%"}
                    >
                      <DateTimePicker setSelectedTime={setSelectedTime} />
                    </Collapse>
                  </Flex>
                </Flex>
                <Flex
                  className="description-button"
                  w={"100%"}
                  h={"100%"}
                  align={"flex-start"}
                  justify={"flex-start"}
                  p={10}
                >
                  <Button
                    onClick={toggleDesc}
                    variant="filled"
                    size="md"
                    p={"10"}
                    radius={15}
                    className="extra-button"
                  >
                    <IconFileDescription
                      size={20}
                      className="add-desscription-icon"
                    />
                  </Button>
                  <Collapse
                    in={descOpened}
                    className="collapse-box"
                    w={"100%"}
                    h={"100%"}
                  >
                    <Textarea
                      placeholder="Add Description..."
                      {...register("description")}
                      h={"100%"}
                      className="task-textarea"
                      error={errors.description?.message}
                    ></Textarea>
                  </Collapse>
                </Flex>
              </Flex>
              <div className="submit-container">
                <Button
                  variant="filled"
                  className="task-add-button"
                  type="submit"
                  size="md"
                  color="#8f9562"
                  radius={"25"}
                >
                  <IconSquareRoundedPlusFilled
                    className="add-icon"
                    size={25}
                    stroke={1.5}
                  />
                  <p className="add-task-text">Add Task</p>
                </Button>
              </div>
            </Flex>
          </Box>
        </form>
      </Container>
    )
  );
};
