import React, { ReactNode } from "react";
import classNames from "classnames";
import { Text } from '@chakra-ui/react'

export default function TextBody({ children, ...restProps }: any) {
  return (
    <Text fontSize="14px" fontWeight="700" color="#1E1E1E" {...restProps}>
      {children}
    </Text>
  )
}
