import React from "react";
import { Flex, Text, Image, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import IconCheveronDown from "@src/assets/icons/chevron-down.svg";
import useBrowser from "@src/hooks/useBrowser";

export default function AccountSelect() {
    const { navigate } = useBrowser();
    return (
        <Flex align="center" gap="1" cursor={"pointer"} onClick={() => navigate("send")}>
            <Text color="brand.red" fontWeight={"800"}>
                Account 1
            </Text>
            <Image src={IconCheveronDown} w="20px" h="20px" />
        </Flex>
    );
}
