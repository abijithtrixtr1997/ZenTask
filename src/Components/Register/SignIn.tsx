import {
  Container,
  Title,
  Text,
  Flex,
  TextInput,
  Button,
  Anchor,
} from "@mantine/core";
import { IconBrandGoogleFilled } from "@tabler/icons-react";
import { handleSignIn, handleSignUp } from "./signUpFunctions";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const onSignIn = async () => {
    const { data, error } = await handleSignIn(email, password);
    if (error) {
      console.error("Unable to sign in.", error);
    } else {
      console.log("User signed in succesfully", data?.user);
      navigate("/");
    }
  };

  const signInWithGoogle = async () => {
    console.log("in sign in function");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}`, // This ensures the OAuth flow uses a pop-up and doesn't redirect the user
      },
    });
    navigate("/");
    if (error) {
      console.log("Google sign-in error:", error);
      return { error };
    }
    return { error: null };
  };

  const onGoogleSignIn = async () => {
    const error = await signInWithGoogle();
    if (error) {
      console.error("Unable to sign in with Google.", error);
    } else {
      console.log("User signed in succesfully with Google.");
      navigate("/");
    }
  };

  return (
    <div className="sign-in">
      <Container className="login-heading">
        <Title ta="center" order={1} size={"xl"}>
          Login
        </Title>
      </Container>
      <Container className="welcome-text">
        <Text size="md" mt={"xs"} tt={"capitalize"} fw={"bold"} ta={"center"}>
          Welcome to ZenTask
        </Text>
      </Container>
      <Flex
        direction={"column"}
        gap={"xs"}
        w={"100%"}
        align={"center"}
        justify={"center"}
        className="user-input"
        p={"xs"}
      >
        <TextInput
          className="username-input"
          w={"100%"}
          type="text"
          name="username"
          placeholder="Username or email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <TextInput
          w={"100%"}
          className="password-input"
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Flex>
      <Flex
        className="forgot-password"
        justify={"center"}
        align={"center"}
        direction={"column"}
        gap={"xs"}
      >
        <Button className="login-button" size="xs" onClick={onSignIn}>
          Sign In
        </Button>
        <Anchor href="#">
          <Text size="xs">Forgot password?</Text>
        </Anchor>
      </Flex>

      <Flex
        className="new-user"
        direction={"column"}
        align={"center"}
        justify={"center"}
      >
        <Flex align={"center"} gap={"xs"} justify={"center"} p={"xs"}>
          <Text fw={"bold"} size="sm">
            New to ZenTask?
          </Text>
          <Button size={"xs"} className="signup-button" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Flex>
        <Container className="or-container" mb={"xs"}>
          <Text size="xs" style={{ fontWeight: "bold" }}>
            Or sign in using
          </Text>
        </Container>
        <Flex
          className="sign-in-methods"
          justify={"center"}
          align={"center"}
          gap={"1rem"}
          h={"3rem"}
        >
          <Button
            className="google-login-button"
            size="md"
            variant="filled"
            onClick={onGoogleSignIn}
          >
            <Text size="lg" p={"xs"}>
              Sign in with Google
            </Text>
            <IconBrandGoogleFilled
              size={"20"}
              stroke={1}
              className="google-icon"
            />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};
