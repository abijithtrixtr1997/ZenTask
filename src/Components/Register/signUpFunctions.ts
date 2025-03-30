import { supabase } from "../../supabaseClient";

export const signInWithGoogle = async () => {
  console.log("in sign in function");
  const { error } = await supabase.auth.signInWithOAuth({
    provider: "google",
  });
  if (error) {
    console.log("Google sign-in error:", error);
  }
};

export const handleSignUp = () => {
  const signIn = document.querySelector(".sign-in") as HTMLElement;
  const signUp = document.querySelector(".sign-up") as HTMLElement;

  if (signIn && signUp) {
    signIn.classList.add("hidden");
    signUp.classList.add("active");
  }
};
