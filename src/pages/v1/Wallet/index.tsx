import React, { useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountCard from "@src/components/AccountCard";
import { Box } from "@chakra-ui/react";
import Operations from "./comp/Operations";
import ActivateHint from "./comp/ActivateHint";
import Footer from "@src/components/Footer";
import Actions from "./comp/Actions";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chain";

export function Wallet() {
    const { selectedAddress, getIsActivated } = useAddressStore();
    const { selectedChainId } = useChainStore();
    const isActivated = getIsActivated(selectedAddress, selectedChainId);

    return (
        <>
            <Box p="5">
                <Navbar />
                <AccountCard />
                {!isActivated ? <ActivateHint /> : <Actions />}
                <Operations />
            </Box>
            <Footer />
        </>
    );
}
