import React from "react";
import { Box, Image, Flex, Text, Menu, MenuButton, MenuList, MenuItem, Tooltip } from "@chakra-ui/react";
import SwitchNetworkLine from "@src/assets/switch-chain-line.svg";
import Button from "../../Button";
import useConfig from "@src/hooks/useConfig";
import IconChevronRight from "@src/assets/icons/chevron-right-red.svg";
import IconCheckmark from "@src/assets/icons/checkmark.svg";
import { InfoWrap, InfoItem } from "../index";
import { useChainStore } from "@src/store/chain";
import { useAddressStore } from "@src/store/address";
import { toShortAddress, getChainInfo } from "@src/lib/tools";

const ChainAvatar = ({ avatar }: any) => (
    <Flex align="center" justify={"center"} bg="#fff" rounded="full" w="72px" h="72px">
        <Image src={avatar} w="44px" h="44px" />
    </Flex>
);

export default function ConnectDapp({ onConfirm, targetChainId }: any) {
    const { selectedAddressItem } = useConfig();
    const { selectedChainId } = useChainStore();
    const { addressList, setSelectedAddress } = useAddressStore();
    const { title, address } = selectedAddressItem;

    const canSwitch = selectedAddressItem.activatedChains.includes(targetChainId);

    return (
        <Box pt="5">
            <Box textAlign={"center"}>
                <Flex align="center" display={"inline-flex"} gap="1" mx="auto" mb="5" position={"relative"}>
                    <ChainAvatar avatar={getChainInfo(selectedChainId).icon} />
                    <Image src={SwitchNetworkLine} />
                    <ChainAvatar avatar={getChainInfo(targetChainId).icon} />
                </Flex>
            </Box>

            <Box textAlign={"center"} mb="176px">
                <Text fontSize={"20px"} fontWeight={"800"} mb="1">
                    Allow network switch?
                </Text>
                <Text fontWeight={"600"}>
                    This will switch the selected network within current dApp to{" "}
                    <Text color="#ee3f99" display={"inline"}>
                        {getChainInfo(targetChainId).name}
                    </Text>
                    .
                </Text>
            </Box>
            <InfoWrap>
                <InfoItem>
                    <Text>{title}:</Text>
                    <Text>
                        <Menu placement="bottom-end">
                            <MenuButton>
                                <Flex align={"center"}>
                                    <Text color="brand.red" fontWeight={"500"}>
                                        {toShortAddress(address, 5, 4)}
                                    </Text>
                                    <Image src={IconChevronRight} />
                                </Flex>
                            </MenuButton>
                            <MenuList maxW={"280px"} pt="4" pb="3" px="4">
                                <Text fontWeight={"800"} lineHeight={"1.25"} mb="3" color="#000">
                                    Select an activated account on this network to continue
                                </Text>
                                {addressList.map((item) => (
                                    <MenuItem key={item.address} px="0" py="3" borderTop={"1px solid #e6e6e6"}>
                                        {item.activatedChains.includes(targetChainId) ? (
                                            <Flex
                                                align={"center"}
                                                w="100%"
                                                justify={"space-between"}
                                                onClick={() => setSelectedAddress(item.address)}
                                            >
                                                <Flex gap="3" align="center">
                                                    <Text fontWeight={"800"}>{item.title}</Text>
                                                    <Text fontSize={"12px"} color="#898989">
                                                        {toShortAddress(item.address, 6, 4)}
                                                    </Text>
                                                </Flex>
                                                {item.address === selectedAddressItem.address && (
                                                    <Image src={IconCheckmark} />
                                                )}
                                            </Flex>
                                        ) : (
                                            <Flex gap="3" align="center" color="#cececf" w="100%" h="100%">
                                                <Text fontWeight={"800"}>{item.title}</Text>
                                                <Text fontSize={"12px"}>{toShortAddress(item.address, 6, 4)}</Text>
                                            </Flex>
                                        )}
                                    </MenuItem>
                                ))}
                            </MenuList>
                        </Menu>
                    </Text>
                </InfoItem>
            </InfoWrap>
            <Button
                w="100%"
                fontSize={"20px"}
                py="4"
                fontWeight={"800"}
                mt="6"
                disabled={!canSwitch}
                onClick={onConfirm}
            >
                Switch network
            </Button>
        </Box>
    );
}
