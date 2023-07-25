import React from "react";
import { Box, Text, Flex, Menu, MenuButton, MenuList, MenuItem, Image } from "@chakra-ui/react";

const TokenLine = ({ icon, symbol, balance, rightElement }: any) => {
    return (
        <Flex>
            <Flex>
                <Flex>
                    <Image src="" />
                    <Text>{symbol}</Text>
                </Flex>
                <Text>Your balance: {balance}</Text>
            </Flex>
            {rightElement && rightElement}
        </Flex>
    );
};

export default function AmountInput() {
    return (
        <Flex flexDir={"column"} gap="3">
            <Menu>
                <MenuButton>
                    <TokenLine icon="" symbol="ETH" balance="123" rightElement="" />
                </MenuButton>
                <MenuList>
                    <MenuItem>
                        <TokenLine icon="" symbol="ETH" balance="123" />
                    </MenuItem>
                    <MenuItem>
                        <TokenLine icon="" symbol="ETH" balance="123" />
                    </MenuItem>
                </MenuList>
            </Menu>
        </Flex>
    );
}
