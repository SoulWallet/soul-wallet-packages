import React, { ReactNode } from "react";
import Logo from "@src/components/web/Logo";
import { Box, Text, Image } from "@chakra-ui/react"

export default function FullscreenContainer({ children }: { children: ReactNode }) {
  return (
    <Box
      background="#F7F7F7"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      padding="32px 0"
      position="relative"
      height="100vh"
      width="100%"
    >
      <Box
        id="animation-portal"
        position="absolute"
        top="0"
        bottom="0"
        left="0"
        right="0"
        display="flex"
        alignItems="center"
        justifyContent="center"
        background="transparent"
      />
      <Logo />
      <div className="max-w-5xl border-white rounded-3xl progress-window-shadow px-4 pt-4 max-h-fit justify-self-center mt-4">
        {children}
      </div>
    </Box>
  );
}
