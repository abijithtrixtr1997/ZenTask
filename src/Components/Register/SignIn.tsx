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
import { handleSignUp, signInWithGoogle } from "./signUpFunctions";

export const SignIn = () => {
  return (
    <div className="sign-in">
      <Container className="login-heading">
        <Title ta="center" order={1}>
          Login
        </Title>
      </Container>
      <Container className="welcome-text">
        <Text size="1.2rem" m={"1rem"} tt={"capitalize"} fw={"bold"}>
          Welcome to ZenTask
        </Text>
      </Container>
      <Flex
        direction={"column"}
        gap={"0.5rem"}
        w={"100%"}
        align={"center"}
        justify={"center"}
        className="user-input"
        p={"1rem"}
      >
        <TextInput
          className="username-input"
          w={"100%"}
          type="text"
          name="username"
          placeholder="Username or email"
        />

        <TextInput
          w={"100%"}
          className="password-input"
          type="password"
          name="password"
          placeholder="Password"
        />
      </Flex>
      <Flex
        className="forgot-password"
        justify={"center"}
        align={"center"}
        direction={"column"}
        gap={"0.5rem"}
      >
        <Button className="login-button">Sign In</Button>
        <Anchor href="#">
          <Text>Forgot password?</Text>
        </Anchor>
      </Flex>

      <Flex
        className="new-user"
        direction={"column"}
        align={"center"}
        justify={"center"}
      >
        <Flex
          align={"center"}
          gap={"0.5rem"}
          justify={"center"}
          mt={"0.5rem"}
          p={"1rem 1rem"}
        >
          <Text fw={"bold"} style={{ fontSize: "1.2rem" }}>
            New to ZenTask?
          </Text>
          <Button className="signup-button" onClick={handleSignUp}>
            Sign Up
          </Button>
        </Flex>
        <div className="or-container">
          <p style={{ fontWeight: "bold", fontSize: "1.2rem" }}>
            Or sign in using
          </p>
        </div>
        <Flex
          className="sign-in-methods"
          justify={"center"}
          align={"center"}
          gap={"1rem"}
          h={"3rem"}
        >
          <Button
            className="google-login-button"
            style={{ height: "3.5rem" }}
            onClick={signInWithGoogle}
          >
            <Text size="lg" p={"0.25rem 0.25rem"} mr={"0.5rem"}>
              Sign in with Google
            </Text>
            <IconBrandGoogleFilled
              size={"1.5rem"}
              stroke={1}
              className="google-icon"
            />
          </Button>
        </Flex>
      </Flex>
    </div>
  );
};
