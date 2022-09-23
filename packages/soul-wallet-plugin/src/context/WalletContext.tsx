import React, { createContext, useState, useEffect } from "react";
import { WalletLib } from "soul-wallet-lib";
import Web3 from "web3";
import config from "@src/config";
import KeyStore from "@src/lib/keystore";

// init global instances
const keyStore = KeyStore.getInstance();
const web3 = new Web3(config.provider);

export const WalletContext = createContext({
    account: "",
    walletAddress: "",
    getGasPrice: () => {},
    activateWallet: () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");

    const getGasPrice = async () => {
        return Number(await web3.eth.getGasPrice());
    };

    const getAccount = async () => {
        const res = await keyStore.getAddress();
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
        setWalletAddress(res);
    };

    const activateWallet = async () => {
        const currentFee = await getGasPrice();
        const activateOp = WalletLib.EIP4337.activateWalletOp(
            config.contracts.entryPoint,
            config.contracts.paymaster,
            account,
            config.contracts.weth,
            currentFee,
            config.defaultTip,
            config.defaultSalt,
        );
        console.log("op is", activateOp);

        const signFunc:any = await keyStore.generateSign()

        console.log('sign func', signFunc)

        const signature = await activateOp.keystoreSign(
            config.contracts.entryPoint,
            config.chainId,
            account,
            signFunc,
        );
        console.log("signature is", signature);
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
                getGasPrice,
                activateWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
