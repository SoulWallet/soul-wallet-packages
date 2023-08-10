import React from 'react'
import { Box, Text, Image } from "@chakra-ui/react";
import IconEmpty from "@src/assets/empty.svg";

interface IEmptyHint {
    title: string;
}
export default function EmptyHint({ title }: IEmptyHint) {
    return (
        <Box textAlign={"center"}>
            <Image src={IconEmpty} w="32" mx="auto" mt="8" display={"block"} />
            <Text mt="2">{title}</Text>
        </Box>
    );
}
