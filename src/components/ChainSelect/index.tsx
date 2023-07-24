import React from "react";
import { Flex, Image, Menu, MenuButton, MenuItem, Button, MenuList } from "@chakra-ui/react";
import IconEth from "@src/assets/chains/eth.svg";
import IconCheveronDownBlack from "@src/assets/icons/chevron-down-black.svg";

export default function ChainSelect() {
    return (
        <Menu>
            <MenuButton>
                <Flex p="5px" bg="white" rounded={"full"} cursor={"pointer"}>
                    <Image src={IconEth} w="22px" h="22px" />
                    <Image src={IconCheveronDownBlack} w="20px" h="20px" />
                </Flex>
            </MenuButton>

            <MenuList>
                <MenuItem>Ethereum</MenuItem>
                <MenuItem>Arbitrum</MenuItem>
                <MenuItem>Optimism</MenuItem>
            </MenuList>
        </Menu>
    );
}
