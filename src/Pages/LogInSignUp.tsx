import { Flex } from "@mantine/core";
import { SignIn } from "../Components/Register/SignIn";
import { SignUp } from "../Components/Register/Signup";

export const LogInSignUp = () => {
  return (
    <div
      className="login-container"
      style={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Flex
        bg={"#CFDEE7"}
        direction={"row"}
        align={"center"}
        justify={"center"}
        className="inner-login-container"
        p={"2rem"}
        w={"25%"}
        mih={"45%"}
        mah={"45%"}
      >
        <SignIn />
        <SignUp />
      </Flex>
    </div>
  );
};
