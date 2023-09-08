import React, { useEffect, useState } from "react";
import IconLoading from "@src/assets/loading.gif";
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
    Modal,
    ModalOverlay,
    ModalContent,
    useDisclosure,
    Input,
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
import useSdk from "@src/hooks/useSdk";
import { useChainStore } from "@src/store/chain";

const EditNameModal = ({ isOpen, onClose, item }: any) => {
    const toast = useToast();
    const [newTitle, setNewTitle] = useState("");
    const { updateAddressItem } = useAddressStore();

    const doChangeName = () => {
        updateAddressItem(item.address, {
            title: newTitle,
        });
        toast({
            title: "Account name updated",
            status: "success",
        });
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter={"blur(7.5px)"} bg="rgba(137, 137, 137, 0.20)" />
            <ModalContent
                mx="20px"
                p="5"
                textAlign={"center"}
                bg="#E2FC89"
                rounded="20px"
                boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
                flexDir={"column"}
                gap="4"
            >
                <Text color="brand.green" fontWeight={"800"} fontSize="18px">
                    Edit account name
                </Text>
                <Input
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={item.title}
                    border={"none"}
                    py="3"
                    px="4"
                    variant="unstyled"
                    bg="#fff"
                    rounded="20px"
                />
                <Flex align={"center"}>
                    <Text
                        w="50%"
                        cursor={"pointer"}
                        onClick={onClose}
                        fontSize={"16px"}
                        fontWeight={"800"}
                        color="brand.green"
                    >
                        Cancel
                    </Text>
                    <Text
                        w="50%"
                        cursor={"pointer"}
                        py="3"
                        fontSize={"16px"}
                        fontWeight={"800"}
                        bg="brand.green"
                        onClick={doChangeName}
                        _hover={{
                            bg: "brand.greenDarken",
                        }}
                        color="#fff"
                        rounded="20px"
                    >
                        Confirm
                    </Text>
                </Flex>
            </ModalContent>
        </Modal>
    );
};

const AccountItem = ({ item, selected, onClick }: any) => {
    const toast = useToast();
    const { isOpen, onClose, onOpen } = useDisclosure();
    const { getIsActivated } = useAddressStore();
    const { selectedChainId } = useChainStore();
    const isActivated = getIsActivated(item.address, selectedChainId);

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
            onClick: onOpen,
        },
        {
            title: "Copy address",
            icon: <Image src={IconCopy} />,
            onClick: doCopy,
        },
    ];

    return (
        <>
            <GridItem
                color={isActivated ? "#29510a" : "#1e1e1e"}
                p="10px"
                cursor={"pointer"}
                rounded="20px"
                onClick={onClick}
                style={
                    selected
                        ? { border: "2px solid #000000CC" }
                        : isActivated
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
                    isActivated
                        ? "linear-gradient(0deg, #E2FC89, #E2FC89),linear-gradient(113.16deg, rgba(244, 255, 176, 0.8) 2.41%, rgba(182, 255, 108, 0.8) 76.58%)"
                        : "linear-gradient(0deg, rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)),linear-gradient(0deg, #D9D9D9, #D9D9D9)"
                }
            >
                <Flex align="center" justify="space-between" mb="2px">
                    <Text fontWeight={"800"} fontSize={"14px"}>
                        {item.title}
                    </Text>
                    <Menu>
                        <MenuButton
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            <Image src={isActivated ? IconAccountMoreGreen : IconAccountMore} />
                        </MenuButton>
                        <MenuList
                            onClick={(e) => {
                                e.stopPropagation();
                            }}
                        >
                            {accountMenus.map((item, idx) => (
                                <React.Fragment key={idx}>
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
                                </React.Fragment>
                            ))}
                        </MenuList>
                    </Menu>
                </Flex>
                <Text fontFamily={"Martian"} fontSize={"10px"} fontWeight={"600"} mb="18px">
                    {item.address.slice(0, 4)}...{item.address.slice(-4)}
                </Text>
                {isActivated ? (
                    <Text fontWeight={"800"} fontSize={"14px"} lineHeight={"1"}>
                        {item.balance}
                    </Text>
                ) : (
                    <Image src={ImgNotActived} />
                )}
            </GridItem>

            <EditNameModal isOpen={isOpen} onClose={onClose} item={item} />
        </>
    );
};

const AccountsNavbar = ({ onAdd, onBack, adding }: any) => {
    return (
        <Flex align="center" justify={"space-between"} mb="6">
            <Flex align="center" onClick={onBack} cursor={"pointer"}>
                <Image src={IconChevronLeft} w="20px" h="20px" />
                <Text fontWeight="800" color="#1C1C1E">
                    Back
                </Text>
            </Flex>
            <Tooltip label="Create new account">
                {adding ? (
                    <Flex align={"center"} justify={"center"} h="8" w="8" bg="#d9d9d9" rounded="full">
                        <Image src={IconLoading} w="6" h="6" />
                    </Flex>
                ) : (
                    <Box _hover={{ bg: "#d9d9d9" }} cursor={"pointer"} rounded={"full"} onClick={onAdd}>
                        <Image src={IconPlus} />
                    </Box>
                )}
            </Tooltip>
        </Flex>
    );
};

export default function Accounts() {
    const { calcWalletAddress } = useSdk();
    const { navigate } = useBrowser();

    const [adding, setAdding] = useState(false);
    const { addressList, selectedAddress, addAddressItem, setSelectedAddress } = useAddressStore();

    const onAdd = async () => {
        setAdding(true);
        const newIndex = addressList.length;
        const newAddress = await calcWalletAddress(newIndex);
        addAddressItem({
            title: `Account ${newIndex + 1}`,
            address: newAddress,
            activatedChains: [],
            activatingChains: [],
            allowedOrigins: [],
        });
        setAdding(false);
    };

    const onBack = () => {
        navigate("wallet");
    };

    return (
        <Box p="5">
            <Navbar />
            <AccountsNavbar onAdd={onAdd} adding={adding} onBack={onBack} />
            <Grid templateColumns={"repeat(2, 1fr)"} gap="3">
                {addressList.map((item: any, index: number) => {
                    return (
                        <AccountItem
                            item={item}
                            key={index}
                            selected={item.address === selectedAddress}
                            onClick={() => {
                                setSelectedAddress(item.address);
                                onBack();
                            }}
                        />
                    );
                })}
            </Grid>
        </Box>
    );
}
