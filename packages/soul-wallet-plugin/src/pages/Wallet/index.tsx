import React, { useState, useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountInfo from "@src/components/AccountInfo";
import Operations from "./comp/Operations";
import Actions from "./comp/Actions";

export function Wallet() {
    const [activated, setActivated] = useState<boolean>(false);
    const { walletAddress, isContract } = useWalletContext();

    const checkActivated = async () => {
        const res = isContract(walletAddress);
        console.log("is Contract", res);
    };

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        checkActivated();
    }, [walletAddress]);

    return (
        <>
            <Navbar />
            <AccountInfo account={walletAddress} action="activate" />
            <Actions />
            <Operations />
        </>
    );
}
