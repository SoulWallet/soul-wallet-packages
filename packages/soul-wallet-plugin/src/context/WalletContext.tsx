import React, { createContext, useState, useEffect } from "react";
import { WalletLib } from "soul-wallet-lib";
import Web3 from "web3";
import { Utils } from "@src/Utils";
import config from "@src/config";
import BN from 'bignumber.js'
import KeyStore from "@src/lib/keystore";

// init global instances
const keyStore = KeyStore.getInstance();
const web3 = new Web3(config.provider);

interface IWalletContext {
    web3: Web3;
    account: string;
    walletAddress: string;
    isContract: (val: string) => Promise<boolean>;
    getBalance: (val:string) => Promise<string>;
    generateWalletAddress: (val: string) => string;
    getGasPrice: () => Promise<number>;
    activateWallet: () => Promise<void>;
}

export const WalletContext = createContext<IWalletContext>({
    web3,
    account: '',
    walletAddress: '',
    isContract: async(val: string) => { return false},
    getBalance: async(val:string) => {return ''},
    generateWalletAddress: (val: string) => {return ''},
    getGasPrice: async() => {return 0},
    activateWallet: async() => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");

    const isContract = async (_address: string) => {
        const contractCode = await web3.eth.getCode(_address);
        console.log(
            "code is",
            contractCode,
            typeof contractCode,
            contractCode !== "0x",
        );
        return contractCode !== "0x";
    };

    const getBalance = async () => {
        const res = await web3.eth.getBalance(walletAddress)
        return new BN(res).shiftedBy(-18).toString();
    }

    const getGasPrice = async () => {
        return Number(await web3.eth.getGasPrice());
    };

    const getAccount = async () => {
        const res = await keyStore.getAddress();
        setAccount(res);
    };

    const generateWalletAddress = (address: string) => {
        const walletAddress = WalletLib.EIP4337.calculateWalletAddress(
            config.contracts.entryPoint,
            address,
            config.contracts.weth,
            config.contracts.paymaster,
            config.defaultSalt,
        );
        console.log('generated', walletAddress)
        return walletAddress;
    };

    const getWalletAddress = async () => {
        const res = await generateWalletAddress(account);
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
                web3,
                account,
                walletAddress,
                isContract,
                getBalance,
                generateWalletAddress,
                getGasPrice,
                activateWallet,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
