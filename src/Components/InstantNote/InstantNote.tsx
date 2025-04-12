import { Flex, TextInput } from "@mantine/core";
import "draft-js/dist/Draft.css";

export const InstantNote = () => {
  return (
    <Flex className="instant-note" p={20}>
      <div className="note-arrow-group">
        <TextInput className="instant-title" size="xs" />
        <div className="instant-description-items"></div>
      </div>
    </Flex>
  );
};
