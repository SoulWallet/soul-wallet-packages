import React, { createContext, useState, useEffect } from "react";
import { WalletLib } from "soul-wallet-lib";
import Web3 from "web3";
import { Utils } from "@src/Utils";
import config from "@src/config";
import BN from "bignumber.js";
import KeyStore from "@src/lib/keystore";

// init global instances
const keyStore = KeyStore.getInstance();
const web3 = new Web3(config.provider);

interface IWalletContext {
    web3: Web3;
    account: string;
    walletAddress: string;
    isContract: (val: string) => Promise<boolean>;
    getEthBalance: () => Promise<string>;
    generateWalletAddress: (val: string) => string;
    getGasPrice: () => Promise<number>;
    activateWallet: () => Promise<void>;
    deleteWallet: () => Promise<void>;
    sendErc20: (
        tokenAddress: string,
        to: string,
        amount: string,
    ) => Promise<void>;
    sendEth: () => Promise<void>;
    replaceAddress: () => Promise<void>;
}

export const WalletContext = createContext<IWalletContext>({
    web3,
    account: "",
    walletAddress: "",
    isContract: async (val: string) => {
        return false;
    },
    getEthBalance: async () => {
        return "";
    },
    generateWalletAddress: (val: string) => {
        return "";
    },
    getGasPrice: async () => {
        return 0;
    },
    activateWallet: async () => {},
    deleteWallet: async () => {},
    sendErc20: async () => {},
    sendEth: async () => {},
    replaceAddress: async () => {},
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

    const getEthBalance = async () => {
        const res = await web3.eth.getBalance(walletAddress);
        return new BN(res).shiftedBy(-18).toString();
    };

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
        console.log("generated wallet address", walletAddress);
        return walletAddress;
    };

    const getWalletAddress = () => {
        const res = generateWalletAddress(account);
        setWalletAddress(res);
    };

    const sendEth = async () => {};

    const sendErc20 = async (
        tokenAddress: string,
        to: string,
        amount: string,
    ) => {
        const currentFee = (await getGasPrice()) * 1.5;
        //todo, handle precision
        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const nonce = WalletLib.EIP4337.Utils.getNonce(walletAddress, web3);
        const op = WalletLib.EIP4337.Tokens.ERC20.transfer(
            web3,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            config.contracts.paymaster,
            currentFee,
            config.defaultTip,
            tokenAddress,
            to,
            amountInWei,
        );
        executeOperation(op);
    };

    const executeOperation = async (operation: any) => {
        const requestId = operation.getRequestId(
            config.contracts.entryPoint,
            config.chainId,
        );

        const signature = await keyStore.sign(requestId);

        if (signature) {
            operation.signWithSignature(account, signature || "");

            await Utils.sendOPWait(
                web3,
                operation,
                config.contracts.entryPoint,
                config.chainId,
            );
        }
    };

    const deleteWallet = async () => {
        await keyStore.delete();
    };

    const replaceAddress = async () => {
        await keyStore.replaceAddress();
    };

    const activateWallet = async () => {
        const currentFee = (await getGasPrice()) * 1.5;
        const activateOp = WalletLib.EIP4337.activateWalletOp(
            config.contracts.entryPoint,
            config.contracts.paymaster,
            account,
            config.contracts.weth,
            currentFee,
            config.defaultTip,
            config.defaultSalt,
        );

        executeOperation(activateOp);

        // const requestId = activateOp.getRequestId(
        //     config.contracts.entryPoint,
        //     config.chainId,
        // );

        // const signature = await keyStore.sign(requestId);

        // if (signature) {
        //     activateOp.signWithSignature(account, signature || "");

        //     await Utils.sendOPWait(
        //         web3,
        //         activateOp,
        //         config.contracts.entryPoint,
        //         config.chainId,
        //     );
        // }
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
                getEthBalance,
                generateWalletAddress,
                getGasPrice,
                activateWallet,
                deleteWallet,
                sendErc20,
                sendEth,
                replaceAddress,
            }}
        >
            {children}
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
