import React, { useState } from "react";
import { Box, Flex, Image, Text, useToast } from "@chakra-ui/react";
import { copyText } from "@src/lib/tools";
import IconCopy from "@src/assets/copy.svg";
import IconScan from "@src/assets/icons/scan.svg";
import IconTrendUp from "@src/assets/icons/trend-up.svg";
import ImgEthFaded from "@src/assets/chains/eth-faded.svg";
import { useAddressStore } from "@src/store/address";

export default function AccountCard() {
    const { selectedAddress } = useAddressStore();

    const toast = useToast();

    const doCopy = () => {
        copyText(selectedAddress);
        toast({
            title: "Copied",
            status: "success",
        });
    };

    return (
        <Flex
            gap="50px"
            flexDir={"column"}
            rounded="24px"
            py="16px"
            px="24px"
            bg="radial-gradient(51.95% 100.00% at 100.00% 100.00%, #A3B2FF 0%, #E2FC89 100%)"
            boxShadow={"0px 4px 8px 0px rgba(0, 0, 0, 0.12)"}
        >
            <Flex align={"center"} justify={"space-between"}>
                <Flex gap="1">
                    <Text fontSize={"12px"} fontFamily={"Martian"} fontWeight={"600"} color="#29510A">
                        {selectedAddress.slice(0, 5)}...{selectedAddress.slice(-4)}
                    </Text>
                    <Image src={IconCopy} w="20px" cursor={"pointer"} onClick={() => doCopy()} />
                </Flex>
                <Image src={IconScan} w="28px" h="28px" />
            </Flex>
            <Flex justify={"space-between"} align="center">
                <Box>
                    <Text color="#29510A" fontSize={"26px"} fontWeight={"800"} mb="6px" lineHeight={"1"}>
                        $1234.56
                    </Text>
                    <Flex gap="1" align="center">
                        <Image src={IconTrendUp} w="12px" h={"12px"} />
                        <Text color="#848488" fontSize="12px" fontWeight={"600"}>
                            $123.45
                        </Text>
                    </Flex>
                </Box>
                <Image src={ImgEthFaded} />
            </Flex>
        </Flex>
    );
}
