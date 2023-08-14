import { nanoid } from "nanoid";
import React, { useEffect, useState } from "react";
import { Box, Text, Image } from "@chakra-ui/react";

interface IProps {
  visible: boolean;
  children: React.ReactNode;
  id?: string;
}

const ModalV2 = ({ visible, children, id = nanoid() }: IProps) => {
  if (!visible) {
    return null
  }

  return (
    <Box
      id={id}
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      zIndex="1"
      boxSizing="border-box"
    >
      <Box
        background="white"
        maxWidth="800px"
        maxHeight="100vh"
        position="relative"
        padding="20px"
        overflow="scroll"
      >
        {children}
      </Box>
    </Box>
  );
};

export default ModalV2;
