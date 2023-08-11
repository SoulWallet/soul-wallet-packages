import React from "react";
import packageJson from "../../../../../package.json";
import IconLogo from "@src/assets/logo-v3.svg";
import { Flex, Image, Text } from "@chakra-ui/react";

export default function SettingFooter() {
    return (
        <Flex
            justify={"space-between"}
            align={"center"}
            w="100%"
            position={"absolute"}
            bottom={"3"}
            px="6"
            left="0"
            right="0"
        >
            <Image src={IconLogo} w="8" />
            <Text fontFamily={"Martian"} fontWeight={"300"} fontSize={"10px"}>
                Version Beta {packageJson.version}
            </Text>
        </Flex>
    );
}
