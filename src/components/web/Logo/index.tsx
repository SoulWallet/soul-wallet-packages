import React from "react";
import LogoIcon from "@src/assets/logo-v3.svg";
import LogoText from "@src/assets/logo-text-v3.svg";
import classNames from "classnames";
import { Box, Image } from '@chakra-ui/react'

export default function Logo() {
  return (
    <Box
      display="flex"
      h="100px"
      alignItems="center"
    >
      <Image src={LogoIcon as any} alt="Logo" />
      <Image src={LogoText as any} alt="Logo Text" marginLeft="10px" marginRight="10px" h="30px" />
    </Box>
  )
}
