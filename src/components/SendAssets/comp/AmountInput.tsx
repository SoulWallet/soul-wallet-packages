import React from "react";
import { Box, Text, Flex, Menu, MenuButton, MenuList, MenuItem, Image, Input, Button } from "@chakra-ui/react";
import IconSwap from "@src/assets/icons/swap.svg";
import config from "@src/config";
import { ITokenItem } from "@src/lib/type";
import TokenLine from "./TokenLine";
import IconChevronRight from "@src/assets/icons/chevron-right.svg";

export default function AmountInput({ sendToken, onTokenChange, amount, onChange }: any) {
    const selectedToken = config.assetsList.filter((item: ITokenItem) => item.address === sendToken)[0];

    return (
        <Flex flexDir={"column"} gap="3" py="3" px="4" bg="#fff" rounded="20px">
            <Menu>
                {({ isOpen }) => (
                    <>
                        <MenuButton>
                            <TokenLine
                                icon={selectedToken.icon}
                                symbol={selectedToken.symbol}
                                memo={`Your balance: 123`}
                                rightElement={
                                    <Image src={IconChevronRight} transform={isOpen ? "rotate(90deg)" : ""} />
                                }
                            />
                        </MenuButton>
                        <MenuList rootProps={{ w: "100%", px: "20px" }}>
                            {config.assetsList
                                .filter((item: ITokenItem) => item.address !== sendToken)
                                .map((item: ITokenItem) => (
                                    <MenuItem w="100%" key={item.symbol}>
                                        <TokenLine
                                            icon={item.icon}
                                            symbol={item.symbol}
                                            memo="123"
                                            onClick={() => onTokenChange(item.address)}
                                        />
                                    </MenuItem>
                                ))}
                        </MenuList>
                    </>
                )}
            </Menu>
            <Box bg="#d7d7d7" h="1px" />
            <Box>
                <Input
                    value={amount}
                    onChange={(e) => onChange(e.target.value)}
                    outline="none"
                    bg="none"
                    border="none"
                    fontSize="40px"
                    fontWeight={"800"}
                    lineHeight={"1"}
                    autoFocus
                    color="#1e1e1e"
                    variant={"unstyled"}
                />
                <Flex align="center" justify={"space-between"}>
                    <Flex gap="2" align="center">
                        <Text fontSize="16px" fontWeight={"800"} color="#898989">
                            $1734
                        </Text>
                        {/* <Image src={IconSwap} /> */}
                    </Flex>
                    <Button
                        bg="brand.red"
                        color="#fff"
                        py="1"
                        fontWeight={"800"}
                        px="2"
                        fontSize={"14px"}
                        height={"unset"}
                        rounded={"full"}
                    >
                        MAX
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}
