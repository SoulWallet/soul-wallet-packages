import React, { useEffect, useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import { Box, Text, Flex, useToast, Image } from "@chakra-ui/react";
import { InfoWrap, InfoItem } from "@src/components/SignTransaction";
import IconEth from "@src/assets/chains/eth.svg";
import { copyText } from "@src/lib/tools";
import ReceiveCode from "@src/components/ReceiveCode";
import Button from "@src/components/Button";

export default function AddFund() {
    const toast = useToast();
    const { walletAddress } = useWalletContext();

    const doCopy = () => {
        copyText(walletAddress);
        toast({
            title: "Copied",
            status: "success",
        });
    };

    return (
        <Box px="5" pt="6">
            <Navbar backUrl="wallet" title="Account 1" />
            <Box bg="#fff" rounded="20px" p="4" mb="14px">
                <ReceiveCode walletAddress={walletAddress} imgWidth="170px" showFullAddress={true} />
            </Box>

            <InfoWrap gap="3">
                <InfoItem>
                    <Text>Supported Networks:</Text>
                    <Flex align="center" gap="2px">
                        {[...Array(3)].map((_, i) => (
                            <Image key={i} src={IconEth} w="20px" />
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
