import React from "react";
import { Box, Text, Flex, Menu, MenuButton, MenuList, MenuItem, Image, Input } from "@chakra-ui/react";
import TokenLine from "./TokenLine";
import Button from "@src/components/Button";
import { ITokenBalanceItem, useBalanceStore } from "@src/store/balanceStore";
import IconChevronRight from "@src/assets/icons/chevron-right.svg";

export default function AmountInput({ sendToken, onTokenChange, amount, onChange }: any) {
    const { tokenBalance } = useBalanceStore();

    const selectedToken = tokenBalance.filter((item: ITokenBalanceItem) => item.contractAddress === sendToken)[0];

    return (
        <Flex flexDir={"column"} gap="3" py="3" px="4" bg="#fff" rounded="20px">
            <Menu>
                {({ isOpen }) => (
                    <>
                        <MenuButton>
                            <TokenLine
                                icon={selectedToken.logoURI}
                                symbol={selectedToken.symbol}
                                memo={`Your balance: ${selectedToken.tokenBalanceFormatted || "0"}`}
                                rightElement={
                                    <Image src={IconChevronRight} transform={isOpen ? "rotate(90deg)" : ""} />
                                }
                            />
                        </MenuButton>
                        <MenuList rootProps={{ w: "100%", px: "20px" }}>
                            {tokenBalance
                                .filter((item: ITokenBalanceItem) => item.contractAddress !== sendToken)
                                .map((item: ITokenBalanceItem) => (
                                    <MenuItem w="100%" key={item.symbol}>
                                        <TokenLine
                                            icon={item.logoURI}
                                            symbol={item.symbol}
                                            memo={item.tokenBalanceFormatted}
                                            onClick={() => onTokenChange(item.contractAddress)}
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
                        color="#fff"
                        py="1"
                        fontWeight={"800"}
                        px="2"
                        fontSize={"14px"}
                        height={"unset"}
                        rounded={"full"}
                        onClick={() => {
                            onChange(selectedToken.tokenBalanceFormatted);
                        }}
                    >
                        MAX
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}
