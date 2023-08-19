import React, { ReactNode } from "react";
import Logo from "@src/components/web/Logo";
import { Box, Text, Image } from "@chakra-ui/react"

export default function FullscreenContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      background="#F7F7F7"
      display="flex"
      alignItems="center"
      justifyContent="flex-start"
      flexDirection="column"
      padding="32px 0"
      position="relative"
      height="100vh"
      width="100%"
    >
      <Box
        id="animation-portal"
        position="fixed"
        top="0"
        bottom="0"
        left="0"
        right="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="transparent"
        zIndex="0"
        pointerEvents="none"
      />
      <Logo />
      <Box
        background="rgba(255, 255, 255, 0.02)"
        padding="1em"
        marginTop="1em"
      >
        {children}
      </Box>
    </Box>
  );
}
