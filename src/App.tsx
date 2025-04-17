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
        "#f3f3f6", // 0 - Lightest (Lavender Mist)
        "#e4e4e6", // 1 - Very Light Gray Lavender
        "#c7c6ce", // 2 - Pale Grayish Violet
        "#a8a6b6", // 3 - Soft Purple Gray
        "#8d8ba1", // 4 - Muted Lavender
        "#7c7a95", // 5 - Default Primary (Dusty Violet)
        "#747190", // 6 - Gentle Indigo
        "#63607d", // 7 - Deep Violet Gray
        "#575571", // 8 - Dark Slate Lavender
        "#4b4964", // 9 - Deepest Shade (Royal Gray Purple)
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

      if (!sessionData.session) {
        setUser(null);
        return;
      }

      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error fetching user:", error.message);
      }
      setUser(data?.user);
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
