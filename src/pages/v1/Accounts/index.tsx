import React, { useEffect, useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import {
    Box,
    Text,
    Flex,
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
import { useAddressStore } from "@src/store/address";
import IconPlus from "@src/assets/icons/plus.svg";
import IconEdit from "@src/assets/icons/edit.svg";
import IconCopy from "@src/assets/icons/copy.svg";

const AccountItem = ({ item, selected, onClick }: any) => {
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
            onClick={onClick}
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
            <Flex align="center" onClick={() => navigate("wallet")} cursor={"pointer"}>
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
    const { addressList, selectedAddress, setSelectedAddress } = useAddressStore();

    return (
        <Box p="5">
            <Navbar />
            <AccountsNavbar />
            <Grid templateColumns={"repeat(2, 1fr)"} gap="3">
                {addressList.map((item: any, index: number) => {
                    return (
                        <AccountItem
                            item={item}
                            key={index}
                            selected={item.address === selectedAddress}
                            onClick={() => {
                                setSelectedAddress(item.address);
                            }}
                        />
                    );
                })}
            </Grid>
        </Box>
    );
}
