// import { Provider } from "react-redux";
import "./App.css";
import { useState, useEffect } from "react";
// import { configureStore } from "@reduxjs/toolkit";
import { MantineProvider, createTheme, Button } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LogInSignUp as Login } from "./Pages/LogInSignUp";
import "@mantine/core/styles.css";
import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js";
import { Home } from "./Pages/Home";
import classes from "./App.module.css";

export const App = () => {
  // const store = configureStore({
  //   reducer: {},
  // });

  const theme = createTheme({
    fontFamily: "Open Sans, sans-serif",
    primaryColor: "gray",
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
      console.log("User fetched successfully!", user);
    };
    fetchUser();
  }, []);

  return (
    <>
      {/* <Provider store={store}> */}
      <MantineProvider theme={theme}>
        <Router>
          <Routes>
            <Route path="/" element={user ? <Home user={user} /> : <Login />} />
          </Routes>
        </Router>
      </MantineProvider>
      {/* </Provider> */}
    </>
  );
};
