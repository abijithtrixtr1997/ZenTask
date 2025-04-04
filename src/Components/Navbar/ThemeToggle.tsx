import { Button } from "@mantine/core";
import "@mantine/core/styles.css";
import { IconBrightness2 } from "@tabler/icons-react";

export const ThemeToggle = () => {
  return (
    <Button
      variant="subtle"
      className="theme-button"
      color="#8f9562"
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
