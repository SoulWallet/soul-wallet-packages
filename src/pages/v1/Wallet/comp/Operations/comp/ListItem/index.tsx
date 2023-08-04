import React from "react";
import { Flex, Box, Text, Image } from "@chakra-ui/react";

interface IListItem {
    idx: number;
    icon: any;
    title: string;
    titleDesc: string;
    amount: string;
    amountDesc: string;
    onClick?: () => void;
}

export default function ListItem({ icon, title, titleDesc, onClick, amount, amountDesc, idx }: IListItem) {
    return (
        <Flex
            onClick={onClick}
            justify={"space-between"}
            align={"center"}
            py="3"
            cursor={"pointer"}
            pt={idx === 0 ? "0px" : ""}
            transition={"all"}
            _hover={{ transform: "scale(0.99)" }}
        >
            <Flex gap="3" align={"center"}>
                <Image src={icon} w="38px" h="38px" />
                <Flex flexDir={"column"} gap="1">
                    <Text fontWeight={"800"}>{title}</Text>
                    <Text fontWeight={"600"}>{titleDesc}</Text>
                </Flex>
            </Flex>
            <Flex flexDir={"column"} gap="1" align="flex-end">
                <Text fontWeight={"800"}>{amount}</Text>
                <Text fontWeight={"600"} color="#898989">
                    {amountDesc}
                </Text>
            </Flex>
        </Flex>
    );
}
