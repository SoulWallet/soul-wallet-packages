import React from "react";
import { Flex, Image, Menu, MenuButton, MenuItem, Text, Button, MenuList, MenuDivider } from "@chakra-ui/react";
import IconCheveronDownBlack from "@src/assets/icons/chevron-down-black.svg";
import IconChecked from "@src/assets/icons/checked.svg";
import { useChainStore } from "@src/store/chainStore";
import useConfig from "@src/hooks/useConfig";

export default function ChainSelect() {
    const { chainList, setSelectedChainId, selectedChainId } = useChainStore();
    const { selectedChainItem } = useConfig();
    return (
        <Menu>
            <MenuButton>
                <Flex p="5px" bg="white" rounded={"full"} cursor={"pointer"}>
                    <Image src={selectedChainItem.icon} w="22px" h="22px" />
                    <Image src={IconCheveronDownBlack} w="20px" h="20px" />
                </Flex>
            </MenuButton>

            <MenuList>
                {chainList.map((item: any, idx: number) => {
                    return (
                        <React.Fragment key={idx}>
                            {idx ? <MenuDivider /> : ""}
                            <MenuItem key={item.chainId} onClick={() => setSelectedChainId(item.chainId)}>
                                <Flex w="100%" align={"center"} justify={"space-between"}>
                                    <Flex align={"center"} gap="2">
                                        <Image src={item.icon} w="5" h="5" />
                                        <Text fontWeight={"700"}>{item.chainName}</Text>
                                    </Flex>
                                    {item.chainId === selectedChainId && <Image src={IconChecked} w="5" h="5" />}
                                </Flex>
                            </MenuItem>
                        </React.Fragment>
                    );
                })}
            </MenuList>
        </Menu>
    );
}
