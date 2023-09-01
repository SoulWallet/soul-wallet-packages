import React from "react";
import { Box } from "@chakra-ui/react"
import WalletCardIcon from "@src/components/Icons/WalletCard";

export default function WalletCard({ statusText }: { statusText: string }) {
  return (
    <Box
      width="100%"
      height="240px"
      padding="20px"
      position="relative"
      background="radial-gradient(51.95% 100% at 100% 100%, #A3B2FF 0%, #E2FC89 100%), linear-gradient(113.16deg, rgba(244, 255, 176, 0.8) 2.41%, rgba(182, 255, 108, 0.8) 76.58%)"
      boxShadow="0px 4.87874698638916px 9.75749397277832px 0px #0000001F"
      borderRadius="30px"
      display="flex"
      alignItems="center"
      justifyContent="center"
      marginBottom="40px"
      marginTop="-20px"
      transform="rotate(-4deg)"
    >
      <Box
        position="absolute"
        bottom="30px"
        right="30px"
      >
        <WalletCardIcon />
      </Box>
      <Box width="100%">
        <Box width="100%" fontSize="16px" fontWeight="bold" marginTop="10px">
          <Box fontSize="12px" background="white" borderRadius="12px" padding="0 10px" display="inline-block" fontWeight="600" fontFamily="Martian">{statusText}</Box>
        </Box>
        <Box width="100%" fontSize="16px" fontWeight="600" marginTop="10px" fontFamily="Martian">YOUR SOUL WALLET!</Box>
      </Box>
    </Box>
  )
}
