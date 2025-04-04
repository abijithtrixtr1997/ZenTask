import { Provider } from "react-redux";
import "./App.css";
import { useState, useEffect } from "react";
import { configureStore } from "@reduxjs/toolkit";
import { MantineProvider, createTheme, Button } from "@mantine/core";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { LogInSignUp as Login } from "./Pages/LogInSignUp";
import "@mantine/core/styles.css";
import { supabase } from "./supabaseClient";
import { User } from "@supabase/supabase-js";
import { Home } from "./Pages/Home";
import classes from "./App.module.css";
import "@fontsource/source-code-pro/400.css";
import todoReducer from "./Components/Slices/TodoSlice";
// import { createTheme } from '@mui/material/styles'

export const App = () => {
  const store = configureStore({
    reducer: {
      todo: todoReducer,
    },
  });

  // const newTheme = (theme) => createTheme({
  //   ...theme,
  //   components: {
  //     MuiPickersToolbar: {
  //       styleOverrides: {
  //         root: {
  //           color: '#8f9562',
  //           borderRadius: '2px',
  //           borderWidth: '1px',
  //           borderColor: '#505730',
  //           border: '1px solid',
  //           backgroundColor: '#f0f2e4',
  //         }
  //       }
  //     }
  //   }
  // })

  const theme = createTheme({
    fontFamily: "Source Code Pro, monospace",
    colors: {
      customPrimary: [
        "#f0f2e4", // 0 - Lightest
        "#e1e4c8", // 1
        "#d2d5ac", // 2
        "#c3c78f", // 3
        "#b4b873", // 4
        "#a5aa57", // 5 - Default shade (can be used for primaryColor)
        "#8f9562", // 6
        "#7a8152", // 7
        "#656c41", // 8
        "#505730", // 9 - Darkest
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
