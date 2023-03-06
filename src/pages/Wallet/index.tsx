import React, { useState, useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountInfo from "@src/components/AccountInfo";
import Operations from "./comp/Operations";
import useErc20Contract from "@src/contract/useErc20Contract";
import Footer from "@src/components/Footer";
import Actions from "./comp/Actions";
import config from "@src/config";

export function Wallet() {
    const { walletAddress } = useWalletContext();
    const erc20Contract = useErc20Contract();

    const getAllowance = async () => {
        const res = await erc20Contract.getAllowance(config.tokens.usdc, config.contracts.paymaster);
        console.log("allowance", res);
    };
    useEffect(() => {
        if (!walletAddress) {
            return;
        }

        getAllowance();
    }, [walletAddress]);

    return (
        <div>
            <Navbar />
            <AccountInfo account={walletAddress} action="activate" />
            <Actions />
            <Operations />
            <Footer />
        </div>
    );
}
