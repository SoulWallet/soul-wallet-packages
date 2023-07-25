import React from "react";
import { Text, TextProps } from "@chakra-ui/react";

interface IPageTitle extends TextProps {
    children: React.ReactNode;
}

export default function PageTitle({ children, ...restProps }: IPageTitle) {
    return (
        <Text fontSize="20px" fontWeight="800" mb="6" {...restProps}>
            {children}
        </Text>
    );
}
