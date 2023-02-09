import React, { createContext, useState, useEffect, createRef } from "react";
import { EIP4337Lib } from "soul-wallet-lib";
import Web3 from "web3";
import Runtime from "@src/lib/Runtime";
import { ethers } from "ethers";
import useKeystore from "@src/hooks/useKeystore";
import SignTransaction from "@src/components/SignTransaction";
import config from "@src/config";
import useWallet from "@src/hooks/useWallet";
const web3 = new Web3(config.provider);

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

interface IWalletContext {
    web3: Web3;
    ethersProvider: ethers.providers.JsonRpcProvider;
    account: string;
    // eoa, contract
    walletType: string;
    walletAddress: string;
    getWalletType: () => Promise<void>;
    getAccount: () => Promise<void>;
    executeOperation: (operation: any, actionName?: string) => Promise<void>;
    replaceAddress: () => Promise<void>;
}

export const WalletContext = createContext<IWalletContext>({
    web3,
    ethersProvider,
    account: "",
    walletType: "",
    walletAddress: "",
    getWalletType: async () => {},
    getAccount: async () => {},
    executeOperation: async () => {},
    replaceAddress: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [walletType, setWalletType] = useState<string>("");
    const signModal = createRef<any>();
    const keyStore = useKeystore();
    const { calculateWalletAddress } = useWallet();

    const getAccount = async () => {
        const res = await keyStore.getAddress();
        setAccount(res);

        console.log("before", res);
        const wAddress = calculateWalletAddress(res);
        console.log("after", wAddress);

        setWalletAddress(wAddress);
    };

    const getWalletType = async () => {
        const contractCode = await web3.eth.getCode(walletAddress);
        setWalletType(contractCode !== "0x" ? "contract" : "eoa");
    };

    const executeOperation = async (
        operation: any,
        // no actionName means no need to sign
        actionName?: string,
    ) => {
        if (actionName) {
            try {
                await signModal.current.show(
                    operation,
                    actionName,
                    "Soul Wallet",
                );
            } catch (err) {
                throw Error("User rejected");
            }
        }

        const requestId = operation.getUserOpHash(
            config.contracts.entryPoint,
            config.chainId,
        );

        const signature = await keyStore.sign(requestId);

        if (signature) {
            operation.signWithSignature(account, signature || "");

            // TODO, should wait for complete
            await Runtime.send("execute", {
                actionName,
                operation: JSON.stringify(operation),
                requestId,
            });

            return;
        }
    };

    const replaceAddress = async () => {
        await keyStore.replaceAddress();
        await getAccount();
    };

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        getWalletType();
    }, [walletAddress]);

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <WalletContext.Provider
            value={{
                web3,
                ethersProvider,
                account,
                walletType,
                walletAddress,
                getAccount,
                executeOperation,
                getWalletType,
                replaceAddress,
            }}
        >
            {children}
            <SignTransaction ref={signModal} />
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
