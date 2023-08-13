import React, { useEffect, useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import { Box, Text, Flex, useToast, Image } from "@chakra-ui/react";
import { InfoWrap, InfoItem } from "@src/components/SignModal";
import IconEth from "@src/assets/chains/eth.svg";
import { copyText } from "@src/lib/tools";
import ReceiveCode from "@src/components/ReceiveCode";
import Button from "@src/components/Button";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chainStore";

export default function AddFund() {
    const toast = useToast();
    const { selectedAddress } = useAddressStore();
    const { chainList } = useChainStore();

    const doCopy = () => {
        copyText(selectedAddress);
        toast({
            title: "Copied",
            status: "success",
        });
    };

    return (
        <Box px="5" pt="6">
            <Navbar backUrl="wallet" title="Account 1" />
            <Box bg="#fff" rounded="20px" p="4" mb="14px">
                <ReceiveCode address={selectedAddress} imgWidth="170px" showFullAddress={true} />
            </Box>

            <InfoWrap gap="3">
                <InfoItem>
                    <Text>Supported Networks:</Text>
                    <Flex align="center" gap="2px">
                        {chainList.map((item, index) => (
                            <Image key={index} src={item.icon} w="20px" />
                        ))}
                    </Flex>
                </InfoItem>
            </InfoWrap>

            <Button w="full" onClick={doCopy} fontSize="20px" py="4" fontWeight={"800"} mt="14px">
                Copy address
            </Button>
        </Box>
    );
}
