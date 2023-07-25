import React from "react";
import { Box } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import { Navbar } from "@src/components/Navbar";
import SendAssets from "@src/components/SendAssets";
import config from "@src/config";

export default function Send() {
    const params = useParams();
    const tokenAddress = params.tokenAddress || config.zeroAddress;
    return (
        <Box p="5">
            <Navbar backUrl="wallet" />
            <SendAssets tokenAddress={tokenAddress} />
        </Box>
    );
}
