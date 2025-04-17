import { Button, Anchor, Flex, Tooltip } from "@mantine/core";
import { IconHome, IconListCheck, IconNotes } from "@tabler/icons-react";
import "./Leftbar.css";

interface LeftBarProps {
  setCurrentPage: (value: string) => void;
}

export const LeftBar = ({ setCurrentPage }: LeftBarProps) => {
  const svgColor = "#c7c6ce";
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
            style={{ borderTop: "2px solid #f3f3f6" }}
          >
            <Anchor w={"100%"}>
              <Tooltip label="Home" position="top-end" offset={5}>
                <Button
                  variant="subtle"
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
                    <IconHome color={svgColor} />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor>
            <Anchor w={"100%"}>
              <Tooltip label="Notes" position="top-end" offset={5}>
                <Button
                  variant="subtle"
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
                    <IconNotes color={svgColor} />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor>
            <Anchor w={"100%"}>
              <Tooltip label="Todo" position="top-end" offset={5}>
                <Button
                  variant="subtle"
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
                    <IconListCheck color={svgColor} />
                  </Flex>
                </Button>
              </Tooltip>
            </Anchor>
          </Flex>
        </div>
      </div>
    </>
  );
};
