import React, { useState } from "react";
import { Flex, Text, Image, Menu, MenuButton, MenuList, MenuItem } from "@chakra-ui/react";
import IconCheveronDown from "@src/assets/icons/chevron-down.svg";
import { useLocation } from "react-router-dom";
import IconCheveronDownBlack from "@src/assets/icons/chevron-down-black.svg";
import useBrowser from "@src/hooks/useBrowser";
import useConfig from "@src/hooks/useConfig";

export default function AccountSelect() {
    const { navigate } = useBrowser();
    const [hovered, setHovered] = useState(false);
    const location = useLocation();
    const { selectedAddressItem } = useConfig();

    const isAccountsPage = location.pathname.includes("/accounts");

    return isAccountsPage ? (
        <Flex align="center" gap="1" fontWeight={"800"} cursor={"pointer"}>
            <Text>All accounts</Text>
        </Flex>
    ) : (
        <Flex
            align="center"
            gap="1"
            fontWeight={"800"}
            cursor={"pointer"}
            _hover={{ color: "brand.red" }}
            onClick={() => navigate("accounts")}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
        >
            <Text>{selectedAddressItem.title}</Text>
            <Image src={hovered ? IconCheveronDown : IconCheveronDownBlack} w="20px" h="20px" />
        </Flex>
    );
}
