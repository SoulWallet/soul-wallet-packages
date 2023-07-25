import React, { useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountCard from "@src/components/AccountCard";
import { Box } from "@chakra-ui/react";
import Operations from "./comp/Operations";
import ActivateHint from "./comp/ActivateHint";
import Footer from "@src/components/Footer";
import Actions from "./comp/Actions";

export function Wallet() {
    const { walletAddress, walletType } = useWalletContext();

    return (
        <>
            <Box p="5">
                <Navbar />
                <AccountCard account={walletAddress} action="activate" />
                {walletType === "contract" && <Actions />}
                {walletType === "eoa" && <ActivateHint />}
                <Operations />
            </Box>
            <Footer />
        </>
    );
}
