import React from "react";
import { Box, Text, Image } from "@chakra-ui/react"

interface IProps {
  src: string;
  onClick?: () => void;
}

export default function Icon({ src, onClick }: IProps) {
  return <Image src={src} w="6" h="6" onClick={onClick} />;
}
