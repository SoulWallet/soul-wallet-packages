import React, { useState, useEffect } from "react";
import { Navbar } from "@src/components/Navbar";
import KeyStore from "@src/lib/keystore";
import { Link } from "react-router-dom";
import AccountInfo from "@src/components/AccountInfo";
import Operations from "./comp/Operations";
import Actions from "./comp/Actions";

const keyStore = KeyStore.getInstance();

export function Wallet() {
    const [account, setAccount] = useState<string>("");

    const getAccount = async () => {
        setAccount(await keyStore.getAddress());
    };

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <>
            <Navbar />
            <AccountInfo account={account} action="activate" />
            <Link to="/sign">Sign</Link>
            <Actions />
            <Operations />
        </>
    );
}
