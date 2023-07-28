import React, { ReactNode } from "react";
import classNames from "classnames";
import { Text } from '@chakra-ui/react'

export default function Heading3({ children, ...restProps }: any) {
  return (
    <Text fontSize="16px" fontWeight="800" color="#1E1E1E" {...restProps}>
      {children}
    </Text>
  )
}
