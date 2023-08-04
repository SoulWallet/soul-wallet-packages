import React from "react";
import { Flex, Box, Text, MenuButton, Menu, MenuList, MenuItem, Image } from "@chakra-ui/react";
import IconChevronRightRed from "@src/assets/icons/chevron-right-red.svg";
import TokenLine from "./TokenLine";
import config from "@src/config";
export default function GasSelect({ gasToken, onChange }: any) {
    return (
        <Menu>
            <MenuButton>
                <Flex align="center">
                    <Text color="brand.red">
                        {config.assetsList.filter((item: any) => item.address === gasToken)[0].symbol}
                    </Text>
                    <Image src={IconChevronRightRed} />
                </Flex>
            </MenuButton>
            <MenuList>
                {config.assetsList.map((item: any) => (
                    <MenuItem key={item.address} onClick={() => onChange(item.address)}>
                        <TokenLine icon={item.icon} symbol={item.symbol} memo="123" />
                    </MenuItem>
                ))}
            </MenuList>
        </Menu>
    );
}
