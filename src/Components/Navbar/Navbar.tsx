import { Title, Button, Container, Flex, Avatar, Popover } from "@mantine/core";
import { IconLogout } from "@tabler/icons-react";
import { ThemeToggle } from "./ThemeToggle";
import { LogoSVG } from "../Images/SVG/SVGs";
import { supabase } from "../../supabaseClient";
import { User } from "@supabase/supabase-js";

import { useNavigate } from "react-router-dom";
// import { useState } from "react";

export const Navbar = ({ user }: { user: User }) => {
  // const [profileOpen, setProfileOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const handleLogOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error logging out:", error.message);
    } else {
      console.log("Logged out successfully!");
      navigate("/login");
    }
  };
  const handleNavigation = () => {
    // setProfileOpen(true);
  };

  return (
    <>
      <Flex align="center" justify="space-between" className="top-navbar">
        <div className="logo-container">
          <LogoSVG fillColor="#fff" />
        </div>

        <Title order={1} style={{ fontSize: "2.8rem" }} ml={"1rem"} c={"#fff"}>
          ZenTask
        </Title>
        <Container className="theme-container" mr={"0.5rem"}>
          <ThemeToggle />
        </Container>
        <Popover
          width={200}
          position="bottom"
          withArrow
          shadow="md"
          closeOnClickOutside
          closeOnEscape
          offset={10}
        >
          <Popover.Target>
            <div className="user-ddm">
              <Avatar variant="filled" src={user?.user_metadata?.avatar_url} />
            </div>
          </Popover.Target>
          <Popover.Dropdown>
            <Flex
              className="ddm-menu"
              align={"center"}
              direction={"column"}
              gap={10}
            >
              <Button
                variant="subtle"
                justify="center"
                fullWidth
                onClick={handleNavigation}
                className="settings-button"
                c={"black"}
              >
                Settings
              </Button>

              <Button
                variant="danger"
                justify="center"
                fullWidth
                onClick={handleLogOut}
              >
                <Flex
                  className="logout-group"
                  align={"center"}
                  justify={"center"}
                >
                  <IconLogout></IconLogout>
                  <p style={{ marginLeft: "0.5rem" }}>Log out</p>
                </Flex>
              </Button>
            </Flex>
          </Popover.Dropdown>
        </Popover>
      </Flex>
    </>
  );
};
