import React, { createContext, useState, useEffect, createRef, useCallback, useMemo } from "react";
import Web3 from "web3";
import Runtime from "@src/lib/Runtime";
import { ethers } from "ethers";
import { useSettingStore } from "@src/store/settingStore";
import SignTransaction from "@src/components/SignTransaction";
import Locked from "@src/components/Locked";
import config from "@src/config";
import useKeyring from "@src/hooks/useKeyring";
import { notify } from "@src/lib/tools";
const web3 = new Web3(config.provider);

const ethersProvider = new ethers.JsonRpcProvider(config.provider);

interface IWalletContext {
    web3: Web3;
    ethersProvider: ethers.JsonRpcProvider;
    account: string;
    // eoa, contract
    walletAddress: string;
    getAccount: () => Promise<void>;
    executeOperation: (operation: any, actionName?: string, gasFormatted?: string) => Promise<void>;
    replaceAddress: () => Promise<void>;
    showLocked: () => void;
}

export const WalletContext = createContext<IWalletContext>({
    web3,
    ethersProvider,
    account: "",
    walletAddress: "",
    getAccount: async () => {},
    executeOperation: async () => {},
    replaceAddress: async () => {},
    showLocked: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const bundlerUrl = useSettingStore((state: any) => state.bundlerUrl);
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState("");
    const [checkingLocked, setCheckingLocked] = useState(true);
    const signModal = createRef<any>();
    const lockedModal = createRef<any>();
    const keystore = useKeyring();

    const getAccount = async () => {
        const res = await keystore.getAddress();
        setAccount(res);
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
                if (err === "User reject") {
                    console.warn(err);
                } else {
                    notify("Error", String(err));
                }
                throw Error(String(err));
            }
        }
    };

    const replaceAddress = async () => {
        await keystore.replaceAddress();
        await getAccount();
    };

    const checkLocked = async () => {
        const current = lockedModal.current;

        const res = await keystore.checkLocked();

        setCheckingLocked(false);

        if (res) {
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

        if (!current || !location) {
            return;
        }

        if (location.hash.indexOf("mode=web") === -1) {
            checkLocked();
        } else {
            setCheckingLocked(false);
        }
    }, [location.hash, lockedModal.current]);

    return (
        <WalletContext.Provider
            value={{
                web3,
                ethersProvider,
                account,
                walletAddress,
                getAccount,
                executeOperation,
                replaceAddress,
                showLocked,
            }}
        >
            {!!checkingLocked ? "" : children}
            <SignTransaction ref={signModal} />
            <Locked ref={lockedModal} />
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
