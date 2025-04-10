import { Button, Anchor, Flex, Tooltip } from "@mantine/core";
import {
  IconCalendar,
  IconHome,
  IconListCheck,
  IconNotes,
} from "@tabler/icons-react";

interface LeftBarProps {
  setCurrentPage: (value: string) => void;
}

export const LeftBar = ({ setCurrentPage }: LeftBarProps) => {
  const handleNavigation = (page: string) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="leftbar">
        <div className="top-gap" style={{ height: "3rem" }}></div>
        <div>
          <Flex
            className="navlinks"
            align="center"
            justify="center"
            direction={"column"}
            gap={"1rem"}
            p={"1rem "}
            style={{ borderTop: "2px solid #8f9562" }}
          >
            <Anchor w={"100%"}>
              <Tooltip label="Home" position="top-end" offset={5}>
                <Button
                  variant="subtle"
                  color="#8f9562"
                  fullWidth
                  className="nav-button"
                  justify="start"
                  onClick={() => handleNavigation("Main")}
                >
                  <Flex
                    className="group-link"
                    align={"center"}
                    gap={"0.5rem"}
                    justify={"center"}
                  >
                    <IconHome />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor>
            <Anchor w={"100%"}>
              <Tooltip label="Notes" position="top-end" offset={5}>
                <Button
                  variant="subtle"
                  color="#8f9562"
                  fullWidth
                  className="nav-button"
                  justify="start"
                  onClick={() => handleNavigation("Note")}
                >
                  <Flex
                    className="group-link"
                    align={"center"}
                    justify={"flex-start"}
                    gap={"0.5rem"}
                  >
                    <IconNotes />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor>
            <Anchor w={"100%"}>
              <Tooltip label="Todo" position="top-end" offset={5}>
                <Button
                  variant="subtle"
                  color="#8f9562"
                  fullWidth
                  className="nav-button"
                  justify="start"
                  onClick={() => handleNavigation("Task")}
                >
                  <Flex
                    className="group-link"
                    align={"center"}
                    justify={"center"}
                    gap={"0.5rem"}
                  >
                    <IconListCheck />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor>
            {/* <Anchor w={"100%"}>
              <Tooltip label="Todo" position="top-end" offset={5}>
                <Button
                  variant="subtle"
                  color="#8f9562"
                  fullWidth
                  className="nav-button"
                  justify="start"
                  onClick={() => handleNavigation("Calender")}
                >
                  <Flex
                    className="group-link"
                    align={"center"}
                    justify={"center"}
                    gap={"0.5rem"}
                  >
                    <IconCalendar />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor> */}
          </Flex>
        </div>
      </div>
    </>
  );
};
