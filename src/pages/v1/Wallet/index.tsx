import React, { useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountCard from "@src/components/AccountCard";
import { Box } from "@chakra-ui/react";
// import * as abi from "@soulwallet/abi";
import useBrowser from "@src/hooks/useBrowser";
import Operations from "./comp/Operations";
import Footer from "@src/components/Footer";
import Actions from "./comp/Actions";

export function Wallet() {
    const { walletAddress } = useWalletContext();
    const { navigate } = useBrowser();

    useEffect(() => {
        navigate("send");
        console.log('navigated')
    }, []);

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
