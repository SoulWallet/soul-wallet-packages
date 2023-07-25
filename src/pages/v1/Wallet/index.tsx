import React from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountCard from "@src/components/AccountCard";
import { Box } from "@chakra-ui/react";
// import * as abi from "@soulwallet/abi";
import Operations from "./comp/Operations";
import Footer from "@src/components/Footer";
import Actions from "./comp/Actions";

export function Wallet() {
    const { walletAddress } = useWalletContext();

    return (
        <>
            <Box p="5">
                <Navbar />
                <AccountCard account={walletAddress} action="activate" />
                <Actions />
                <Operations />
            </Box>
            <Footer />
        </>
    );
}
