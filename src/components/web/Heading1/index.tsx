import React, { ReactNode } from "react";
import { Text } from '@chakra-ui/react'

export default function Heading1({ _styles, children, onClick }: any) {
  return (
    <Text fontSize="24px" fontWeight="800" marginBottom="10px" color="#1E1E1E" {..._styles} onClick={onClick}>
      {children}
    </Text>
  )
}
