import React, { useEffect, useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import {
    Box,
    Text,
    Flex,
    Divider,
    Tooltip,
    useToast,
    Image,
    Grid,
    GridItem,
    Menu,
    MenuList,
    MenuItem,
    MenuButton,
    MenuDivider,
} from "@chakra-ui/react";
import IconAccountMore from "@src/assets/icons/account-more.svg";
import IconAccountMoreGreen from "@src/assets/icons/account-more-green.svg";
import ImgNotActived from "@src/assets/not-activated.svg";
import { copyText } from "@src/lib/tools";
import useBrowser from "@src/hooks/useBrowser";
import IconChevronLeft from "@src/assets/icons/chevron-left.svg";

import IconPlus from "@src/assets/icons/plus.svg";
import IconEdit from "@src/assets/icons/edit.svg";
import IconCopy from "@src/assets/icons/copy.svg";

const mockAccounts = [
    {
        name: "Account 1",
        address: "0xa9E8a3Cc094141A135A193f0a0d786441fa64E9c",
        balance: "$1234.56",
        activated: true,
    },
    {
        name: "Account 2",
        address: "0x80eDfd33BdD76573bDEF5Cdb37e579657476aab6",
        balance: "$1234.56",
        activated: true,
    },
    {
        name: "Account 3",
        address: "0x80eDfd33BdD76573bDEF5Cdb37e579657476aab6",
        balance: "$1234.56",
        activated: true,
    },
    {
        name: "Account 4",
        address: "0x80eDfd33BdD76573bDEF5Cdb37e579657476aab6",
        balance: "0",
        activated: false,
    },
];

const AccountItem = ({ item, selected }: any) => {
    const toast = useToast();

    const doCopy = () => {
        copyText(item.address);
        toast({
            title: "Copied",
            status: "success",
        });
    };

    const accountMenus = [
        {
            title: "Edit account name",
            icon: <Image src={IconEdit} />,
            onClick: () => {},
        },
        {
            title: "Copy address",
            icon: <Image src={IconCopy} />,
            onClick: doCopy,
        },
    ];

    return (
        <GridItem
            color={item.activated ? "#29510a" : "#1e1e1e"}
            p="10px"
            cursor={item.activated ? "pointer" : ""}
            rounded="20px"
            style={
                selected
                    ? { border: "2px solid #000000CC" }
                    : item.activated
                    ? {
                          border: "1px solid",
                          borderImageSource:
                              "linear-gradient(113.16deg, rgba(244, 255, 176, 0.8) 2.41%, rgba(182, 255, 108, 0.8) 76.58%)",
                          borderImageSlice: 1,
                          borderImageWidth: "1",
                          borderImageOutset: 0,
                          borderImageRepeat: "stretch",
                      }
                    : {
                          border: "1px solid #00000033",
                      }
            }
            boxShadow={"0px 4px 8px 0px #0000001F"}
            bg={
                item.activated
                    ? "linear-gradient(0deg, #E2FC89, #E2FC89),linear-gradient(113.16deg, rgba(244, 255, 176, 0.8) 2.41%, rgba(182, 255, 108, 0.8) 76.58%)"
                    : "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),linear-gradient(0deg, #D9D9D9, #D9D9D9)"
            }
        >
            <Flex align="center" justify="space-between" mb="2px">
                <Text fontWeight={"800"} fontSize={"14px"}>
                    {item.name}
                </Text>
                <Menu>
                    <MenuButton>
                        <Image src={item.activated ? IconAccountMoreGreen : IconAccountMore} />
                    </MenuButton>
                    <MenuList>
                        {accountMenus.map((item, idx) => (
                            <>
                                {idx > 0 && <MenuDivider />}
                                <MenuItem
                                    fontWeight={"700"}
                                    color="#1e1e1e"
                                    iconSpacing={"5px"}
                                    icon={item.icon}
                                    onClick={item.onClick}
                                >
                                    {item.title}
                                </MenuItem>
                            </>
                        ))}
                    </MenuList>
                </Menu>
            </Flex>
            <Text fontFamily={"Martian"} fontSize={"10px"} fontWeight={"600"} mb="18px">
                {item.address.slice(0, 4)}...{item.address.slice(-4)}
            </Text>
            {item.activated ? (
                <Text fontWeight={"800"} fontSize={"14px"} lineHeight={"1"}>
                    {item.balance}
                </Text>
            ) : (
                <Image src={ImgNotActived} />
            )}
        </GridItem>
    );
};

const AccountsNavbar = () => {
    const { navigate } = useBrowser();

    return (
        <Flex align="center" justify={"space-between"} mb="6">
            <Flex align="center" position="relative" zIndex={10} onClick={() => navigate("wallet")} cursor={"pointer"}>
                <Image src={IconChevronLeft} w="20px" h="20px" />
                <Text fontWeight="800" color="#1C1C1E">
                    Back
                </Text>
            </Flex>
            <Tooltip label="Add account">
                <Box _hover={{ bg: "#d9d9d9" }} cursor={"pointer"} rounded={"full"}>
                    <Image src={IconPlus} />
                </Box>
            </Tooltip>
        </Flex>
    );
};

export default function Accounts() {
    const { walletAddress } = useWalletContext();

    return (
        <Box p="5">
            <Navbar />
            <AccountsNavbar />
            <Grid templateColumns={"repeat(2, 1fr)"} gap="3">
                {mockAccounts.map((item, index) => {
                    return <AccountItem item={item} key={index} selected={item.address === walletAddress} />;
                })}
            </Grid>
        </Box>
    );
}
