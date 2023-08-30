import React, { useEffect, useState } from "react";
import { Navbar } from "@src/components/Navbar";
import AccountCard from "@src/components/AccountCard";
import { Box } from "@chakra-ui/react";
import Operations from "./comp/Operations";
import ActivateHint from "./comp/ActivateHint";
import SetGuardianHint from "./comp/SetGuardianHint";
import Footer from "@src/components/Footer";
import Actions from "./comp/Actions";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chain";
import { useGuardianStore } from "@src/store/guardian";

export function Wallet() {
    const { selectedAddress, getIsActivated } = useAddressStore();
    const { selectedChainId } = useChainStore();
    const { guardians } = useGuardianStore();
    const isActivated = getIsActivated(selectedAddress, selectedChainId);
    const [skipSet, setSkipSet] = useState(false);

    const showSetGuardian =
        isActivated &&
        guardians.length === 0 &&
        (!localStorage.getItem("skipSet") || localStorage.getItem("skipSet") !== "true") && !skipSet;

    return (
        <>
            <Box p="5">
                <Navbar />
                <AccountCard />
                {!isActivated ? <ActivateHint /> : <Actions showSetGuardian={showSetGuardian && !skipSet} />}
                {showSetGuardian && !skipSet && <SetGuardianHint onSkip={()=> setSkipSet(true)} />}
                <Operations />
            </Box>
            <Footer />
        </>
    );
}
