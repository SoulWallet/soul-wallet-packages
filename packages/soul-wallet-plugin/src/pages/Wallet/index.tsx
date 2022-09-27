import React, { useState, useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountInfo from "@src/components/AccountInfo";
import Operations from "./comp/Operations";
import api from "@src/lib/api";
import Actions from "./comp/Actions";

export function Wallet() {
    //TODO, BUG, first time entrance will show EOA address

    const [activated, setActivated] = useState<boolean>(false);
    const { walletAddress, isContract } = useWalletContext();

    const checkActivated = async () => {
        console.log("wallet addr", walletAddress);
        const res = await isContract(walletAddress);
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
