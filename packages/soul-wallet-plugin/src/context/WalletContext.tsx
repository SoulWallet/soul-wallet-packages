import React, { createContext, useState, useEffect } from "react";
import { WalletLib } from "soul-wallet-lib";
import Web3 from "web3";
import { Utils } from "@src/Utils";
import config from "@src/config";
import KeyStore from "@src/lib/keystore";

// init global instances
const keyStore = KeyStore.getInstance();
const web3 = new Web3(config.provider);

export const WalletContext = createContext({
    account: "",
    walletAddress: "",
    isContract: (address: string) => {},
    getGasPrice: () => {},
    activateWallet: () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");

    const isContract = async (_address: string) => {
        return await web3.eth.getCode(_address);
    };

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
        const currentFee = (await getGasPrice()) * 2;
        const activateOp = WalletLib.EIP4337.activateWalletOp(
            config.contracts.entryPoint,
            config.contracts.paymaster,
            account,
            config.contracts.weth,
            currentFee,
            config.defaultTip,
            config.defaultSalt,
        );

        const requestId = activateOp.getRequestId(
            config.contracts.entryPoint,
            config.chainId,
        );

        const signature = await keyStore.sign(requestId);

        if (!signature) {
            activateOp.signWithSignature(account, signature || "");

            await Utils.sendOPWait(
                web3,
                activateOp,
                config.contracts.entryPoint,
                config.chainId,
            );
        }
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
                isContract,
                getGasPrice,
                activateWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
