import { Provider } from "react-redux";
import "./App.css";
import { useState, useEffect } from "react";
import { MantineProvider, createTheme, Button } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LogInSignUp as Login } from "./Pages/LogInSignUp";
import "@mantine/core/styles.css";
import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js";
import { Home } from "./Pages/Home";
import classes from "./App.module.css";
import "@fontsource/source-code-pro/400.css";
import { store } from "./Store";

export const App = () => {
  const theme = createTheme({
    fontFamily: "__GeistSans, '__GeistSans_Fallback', sans-serif", // Use your custom font here
    colors: {
      customPrimary: [
        "#ffffff", // 0 - Lightest (White)
        "#f0f0f0", // 1 - Very light gray
        "#d9d9d9", // 2 - Light gray
        "#b3b3b3", // 3 - Medium light gray
        "#8c8c8c", // 4 - Medium gray
        "#666666", // 5 - Default shade (can be used for primaryColor, Mid gray)
        "#4d4d4d", // 6 - Dark gray
        "#333333", // 7 - Darker gray
        "#1a1a1a", // 8 - Very dark gray
        "#000000", // 9 - Darkest (Black)
      ],
    },
    primaryColor: "customPrimary",
    components: {
      Button: Button.extend({
        classNames: classes,
      }),
    },
  });

  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      console.log("Session Data:", sessionData);

      if (!sessionData.session) {
        console.log("No active session, user is not logged in.");
        setUser(null);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      }
      setUser(data?.user);
      console.log("User fetched successfully!", data?.user);
    };
    fetchUser();
  }, []);

  return (
    <>
      <Provider store={store}>
        <MantineProvider theme={theme}>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={user ? <Home user={user} /> : <Login />}
              />
            </Routes>
          </Router>
        </MantineProvider>
      </Provider>
    </>
  );
};
