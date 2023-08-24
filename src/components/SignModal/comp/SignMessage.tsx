import React from "react";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import Button from "../../Button";
import { AddressInput, AddressInputReadonly } from "../../SendAssets/comp/AddressInput";
import { useAddressStore } from "@src/store/address";
import useConfig from "@src/hooks/useConfig";
import { toShortAddress } from "@src/lib/tools";

export default function SignMessage({ messageToSign, onSign, origin }: any) {
    const { selectedAddress } = useAddressStore();
    const {selectedAddressItem} = useConfig();

    return (
        <>
            <Text fontSize="20px" fontWeight="800" color="#1e1e1e">
                Sign Message
            </Text>

            {origin && (
                <Text fontWeight={"600"} mt="1">
                    {origin}
                </Text>
            )}

            <Flex flexDir={"column"} gap="5" mt="6">
                <Box bg="#fff" py="3" px="4" rounded="20px" fontWeight={"800"}>
                    {messageToSign}
                </Box>
                <AddressInputReadonly
                    label="From"
                    value={selectedAddressItem.title}
                    memo={toShortAddress(selectedAddressItem.address)}
                />
            </Flex>
            <Button w="100%" fontSize={"20px"} py="4" fontWeight={"800"} mt="6" onClick={onSign}>
                Sign
            </Button>
        </>
    );
}
