import { Button } from "@mantine/core";
import "@mantine/core/styles.css";
import { IconBrightness2 } from "@tabler/icons-react";

export const ThemeToggle = () => {
  return (
    <Button
      variant="filled"
      className="theme-button"
      h="2.2rem"
      w={"2.2rem"}
      p={0}
      m={0}
      radius={"50%"}
    >
      <IconBrightness2
        className="icon"
        size={"1.5rem"}
        stroke={1.5}
        color="white"
      />
    </Button>
  );
};
