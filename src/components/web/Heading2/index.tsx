import React, { ReactNode } from "react";
import classNames from "classnames";
import { Text } from '@chakra-ui/react'

export default function Heading2({ children, ...restProps }: any) {
  return (
    <Text fontSize="22px" fontWeight="800" marginBottom="8px" color="#1E1E1E" {...restProps}>
      {children}
    </Text>
  )
}
