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
        "#212529", // 0 - Deepest Shade (Charcoal Gray)
        "#343a40", // 1 - Very Dark Gray
        "#495057", // 2 - Dark Gray
        "#6c757d", // 3 - Slate Gray
        "#adb5bd", // 4 - Light Cool Gray
        "#ced4da", // 5 - Default Primary (Muted Light Gray)
        "#dee2e6", // 6 - Pale Gray
        "#e9ecef", // 7 - Very Pale Gray
        "#f8f9fa", // 8 - Off White
        "#fdfdfe", // 9 - Lightest Shade (Near White)
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
