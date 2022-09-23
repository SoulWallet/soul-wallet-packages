import React, { createContext, useState, useEffect } from "react";
import { WalletLib } from "soul-wallet-lib";
import config from "@src/config";
import KeyStore from "@src/lib/keystore";
const keyStore = KeyStore.getInstance();

export const WalletContext = createContext({
    account: "",
    walletAddress: "",
});

export const WalletContextProvider = ({ children }: any) => {
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");

    const getAccount = async () => {
        const res = await keyStore.getAddress();
        console.log("user account is", res);
        setAccount(res);
    };

    const getWalletAddress = async () => {
        const res = await WalletLib.EIP4337.calculateWalletAddress(
            config.contracts.entryPoint,
            account,
            config.contracts.weth,
            config.contracts.paymaster,
            config.defaultSalt,
        );
        console.log("wallet addressi s", res);
        setWalletAddress(res);
    };

    useEffect(() => {
        if (!account) {
            return;
        }
        getWalletAddress();
    }, [account]);

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <WalletContext.Provider
            value={{
                account,
                walletAddress,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
