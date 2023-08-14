import React from "react";
import { Text, TextProps } from '@chakra-ui/react'

export default function TextBody({ children, ...restProps }: TextProps) {
  return (
    <Text fontSize="14px" fontWeight="700" color="#1E1E1E" {...restProps}>
      {children}
    </Text>
  )
}
