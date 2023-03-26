import React, { createContext, useState, useEffect, createRef } from "react";
import Web3 from "web3";
import Runtime from "@src/lib/Runtime";
import { getLocalStorage, notify } from "@src/lib/tools";
import { ethers } from "ethers";
import { useSettingStore } from "@src/store/settingStore";
import SignTransaction from "@src/components/SignTransaction";
import Locked from "@src/components/Locked";
import config from "@src/config";
import useKeystore from "@src/hooks/useKeystore";
import useQuery from "@src/hooks/useQuery";
const web3 = new Web3(config.provider);

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

interface IWalletContext {
    web3: Web3;
    ethersProvider: ethers.providers.JsonRpcProvider;
    account: string;
    // eoa, contract
    walletType: string;
    walletAddress: string;
    getWalletType: () => Promise<string>;
    getAccount: () => Promise<void>;
    executeOperation: (operation: any, actionName?: string, gasFormatted?: string) => Promise<void>;
    replaceAddress: () => Promise<void>;
    showLocked: () => void;
}

export const WalletContext = createContext<IWalletContext>({
    web3,
    ethersProvider,
    account: "",
    walletType: "",
    walletAddress: "",
    getWalletType: async () => {
        return "";
    },
    getAccount: async () => {},
    executeOperation: async () => {},
    replaceAddress: async () => {},
    showLocked: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const bundlerUrl = useSettingStore((state: any) => state.bundlerUrl);
    const { estimateUserOperationGas } = useQuery();

    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState("");
    const [checkingLocked, setCheckingLocked] = useState(true);
    const [walletType, setWalletType] = useState("");
    const signModal = createRef<any>();
    const lockedModal = createRef<any>();
    const keystore = useKeystore();

    const getAccount = async () => {
        const res = await keystore.getAddress();
        const wAddress = await getLocalStorage("walletAddress");
        setAccount(res);
        setWalletAddress(wAddress);
    };

    const getWalletType = async () => {
        const contractCode = await web3.eth.getCode(walletAddress);
        const wType = contractCode !== "0x" ? "contract" : "eoa";
        setWalletType(wType);
        return wType;
    };

    const executeOperation = async (
        operation: any,
        // no actionName means no need to sign
        actionName?: string,
    ) => {
        if (actionName) {
            try {
                const paymasterAndData = await signModal.current.show(operation, actionName, "Soul Wallet", false);

                operation.paymasterAndData = paymasterAndData ? paymasterAndData : "0x";

                await estimateUserOperationGas(operation);

                const userOpHash = operation.getUserOpHashWithTimeRange(
                    config.contracts.entryPoint,
                    config.chainId,
                    account,
                );

                const signature = await keystore.sign(userOpHash);

                if (!signature) {
                    throw new Error("Failed to sign");
                }

                operation.signWithSignature(account, signature || "");

                await Runtime.send("execute", {
                    // actionName,
                    operation: operation.toJSON(),
                    userOpHash,
                    bundlerUrl,
                });
            } catch (err) {
                console.log("err", err);
                // notify("")
                throw Error("User rejected");
            }
        }
    };

    const replaceAddress = async () => {
        await keystore.replaceAddress();
        await getAccount();
    };

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        getWalletType();
    }, [walletAddress]);

    const checkLocked = async () => {
        const current = lockedModal.current;

        const res = await keystore.checkLocked();

        if (res) {
            console.log("ready to show");
            await current.show();
        }
    };

    const showLocked = async () => {
        await lockedModal.current.show();
    };

    useEffect(() => {
        getAccount();
    }, []);

    useEffect(() => {
        const current = lockedModal.current;
        if (!current || !location.hash) {
            return;
        }
        setCheckingLocked(false);

        if (location.hash.indexOf("mode=web") === -1) {
            checkLocked();
        }
    }, [location.hash, lockedModal.current]);

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
                showLocked,
            }}
        >
            {/* {checkingLocked ? "checking" : children} */}
            {children}
            <SignTransaction ref={signModal} />
            <Locked ref={lockedModal} />
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
