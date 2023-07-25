import React from "react";
import { Flex, Image, Text } from "@chakra-ui/react";

export default function TokenLine({ icon, symbol, memo, rightElement, onClick }: any) {
    return (
        <Flex onClick={onClick} align={"center"} justify={"space-between"} w="100%">
            <Flex gap="3" align="center">
                <Flex gap="1" align="center">
                    <Image src={icon} w="20px" h={"20px"} />
                    <Text fontWeight={"800"} color="#1e1e1e">
                        {symbol}
                    </Text>
                </Flex>
                <Text fontSize="12px" color="#898989" fontWeight={"600"}>
                    {memo}
                </Text>
            </Flex>
            {rightElement && rightElement}
        </Flex>
    );
}
