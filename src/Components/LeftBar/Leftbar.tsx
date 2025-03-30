import {
  Collapse,
  Group,
  Button,
  Box,
  Anchor,
  Flex,
  Tooltip,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconHome,
  IconListCheck,
  IconMenu2,
  IconNotes,
} from "@tabler/icons-react";

export const LeftBar = () => {
  const [opened, { toggle }] = useDisclosure(false);
  return (
    <>
      <div className="leftbar">
        <Box maw={400} mx={"auto"} className="box-leftbar" p={0} m={0}>
          <Group justify="center" mb={5}>
            <Button
              mb={"0.5rem"}
              onClick={toggle}
              w={"3.5rem"}
              h={"2rem"}
              p={0}
              m={0}
            >
              <IconMenu2 size={"1.2rem"}></IconMenu2>
            </Button>
          </Group>
          <div>
            <Flex
              className="navlinks"
              align="center"
              justify="center"
              direction={"column"}
              gap={"1rem"}
              p={"1rem "}
              style={{ borderTop: "2px solid #999" }}
            >
              <Anchor w={"100%"}>
                <Tooltip label="Home" position="top-end" offset={5}>
                  <Button
                    variant="subtle"
                    color="gray"
                    fullWidth
                    className="nav-button"
                    justify="start"
                  >
                    <Flex
                      className="group-link"
                      align={"center"}
                      gap={"0.5rem"}
                      justify={"center"}
                    >
                      <IconHome />
                      <Collapse in={opened}>
                        <p>Home</p>
                      </Collapse>
                    </Flex>
                  </Button>
                </Tooltip>
              </Anchor>
              <Anchor w={"100%"}>
                <Tooltip label="Notes" position="top-end" offset={5}>
                  <Button
                    variant="subtle"
                    color="gray"
                    fullWidth
                    className="nav-button"
                    justify="start"
                  >
                    <Flex
                      className="group-link"
                      align={"center"}
                      justify={"flex-start"}
                      gap={"0.5rem"}
                    >
                      <IconNotes />
                      <Collapse in={opened}>
                        <p>Notes</p>
                      </Collapse>
                    </Flex>
                  </Button>
                </Tooltip>
              </Anchor>
              <Anchor w={"100%"}>
                <Tooltip label="Todo" position="top-end" offset={5}>
                  <Button
                    variant="subtle"
                    color="gray"
                    fullWidth
                    className="nav-button"
                    justify="start"
                  >
                    <Flex
                      className="group-link"
                      align={"center"}
                      justify={"center"}
                      gap={"0.5rem"}
                    >
                      <IconListCheck />
                      <Collapse in={opened}>
                        <p>Todo</p>
                      </Collapse>
                    </Flex>
                  </Button>
                </Tooltip>
              </Anchor>
            </Flex>
          </div>
        </Box>
      </div>
    </>
  );
};
