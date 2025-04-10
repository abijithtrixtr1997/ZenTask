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
        position: "relative",
        background: "transparent",
      }}
    >
      <div className="login-page-logo"></div>

      <div className="inner-login-container">
        <SignIn />
        <SignUp />
      </div>
    </div>
  );
};
