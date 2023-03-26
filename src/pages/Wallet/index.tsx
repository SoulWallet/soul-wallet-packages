import React from "react";
import Button from "@src/components/Button";
import { Navbar } from "@src/components/Navbar";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountInfo from "@src/components/AccountInfo";
import Operations from "./comp/Operations";
import Footer from "@src/components/Footer";
import useBrowser from "@src/hooks/useBrowser";
import Actions from "./comp/Actions";

export function Wallet() {
    const { walletAddress } = useWalletContext();
    const { goPlugin } = useBrowser();

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
