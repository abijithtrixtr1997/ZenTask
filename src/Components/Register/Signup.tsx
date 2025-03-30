import { Flex, TextInput, Button, PasswordInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { supabase } from "../../supabaseClient";
import { IconArrowLeft } from "@tabler/icons-react";
import { handleBackClick } from "./signUpFunctions";

interface SignUpFormValues {
  email: string;
  password: string;
  displayName: string;
  confirmPassword: string;
}

export const SignUp = () => {
  const form = useForm({
    mode: "uncontrolled",
    initialValues: {
      email: "",
      password: "",
      confirmPassword: "",
      displayName: "",
    },

    validate: {
      email: (value) => (/^\S+@\S+\.\S+$/.test(value) ? null : "Invalid email"),
      password: (value) => {
        if (value.length < 6) return "Password must be at least 6 characters";
        if (!/[A-Z]/.test(value))
          return "Must include at least one uppercase letter";
        if (!/[a-z]/.test(value))
          return "Must include at least one lowercase letter";
        if (!/\d/.test(value)) return "Must include at least one digit";
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(value))
          return "Must include at least one special character";
        return null;
      },
      confirmPassword: (value, values) =>
        value === values.password ? null : "Passwords do not match",
      displayName: (value) =>
        value.trim().length > 0 ? null : "Display Name is required",
    },
  });

  const onSubmit = async (values: SignUpFormValues) => {
    const { email, password } = values;
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: "http://localhost:5173/#", // Change this to your desired URL
        },
      });
      if (error) {
        console.error("Error signing up:", error.message);
        throw new Error(error.message);
      }
      const user = data?.user;

      if (user) {
        console.log("User profile updated successfully!");
        console.log(user);
      }
    } catch (error) {
      console.error("Error signing up user:", (error as Error).message);
    }
  };

  return (
    <div
      className="sign-up"
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <div className="back-arrow-container">
        <Button className="back-arrow" onClick={handleBackClick} size="xs">
          <IconArrowLeft></IconArrowLeft>
        </Button>
      </div>
      <Flex
        className="signup-form"
        w={"80%"}
        direction={"column"}
        align={"center"}
        justify={"center"}
      >
        <form onSubmit={form.onSubmit(onSubmit)} style={{ width: "100%" }}>
          <TextInput
            withAsterisk
            label="Email"
            styles={{
              label: { fontSize: "1rem", marginBottom: "0.3rem" }, // Custom font size
            }}
            name="email"
            placeholder="Email..."
            w="100%"
            mb={"0.75rem"}
            {...form.getInputProps("email")}
          />
          <TextInput
            withAsterisk
            styles={{
              label: { fontSize: "1rem", marginBottom: "0.3rem" }, // Custom font size
            }}
            label="Display Name:"
            w="100%"
            name="displayName"
            placeholder="Display Name..."
            mb={"0.75rem"}
            {...form.getInputProps("displayName")}
          />
          <PasswordInput
            withAsterisk
            styles={{
              label: { fontSize: "1rem", marginBottom: "0.3rem" }, // Custom font size
            }}
            w="100%"
            variant="filled"
            mb={"0.75rem"}
            label="Password:"
            placeholder="Password..."
            {...form.getInputProps("password")}
          />
          <PasswordInput
            withAsterisk
            w="100%"
            styles={{
              label: { fontSize: "1rem", marginBottom: "0.3rem" }, // Custom font size
            }}
            variant="filled"
            mb={"0.75rem"}
            label="Confirm Password"
            placeholder="Retype Password..."
            {...form.getInputProps("confirmPassword")}
          />
          <Button
            mt="0.75rem"
            mr={"0.5rem"}
            className="signup-button"
            style={{ alignSelf: "end", fontSize: "1rem" }}
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </Flex>
    </div>
  );
};
