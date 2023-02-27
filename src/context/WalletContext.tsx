import React, { createContext, useState, useEffect, createRef } from "react";
import Web3 from "web3";
import Runtime from "@src/lib/Runtime";
import { getLocalStorage } from "@src/lib/tools";
import { ethers } from "ethers";
import { useSettingStore } from "@src/store/settingStore";
import SignTransaction from "@src/components/SignTransaction";
import Locked from "@src/components/Locked";
import config from "@src/config";
import useKeystore from "@src/hooks/useKeystore";
import useWallet from "@src/hooks/useWallet";
import useLib from "@src/hooks/useLib";
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
    getWalletType: async () => {},
    getAccount: async () => {},
    executeOperation: async () => {},
    replaceAddress: async () => {},
    showLocked: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const bundlerUrl = useSettingStore((state: any) => state.bundlerUrl);

    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState("");
    const [walletType, setWalletType] = useState("");
    const signModal = createRef<any>();
    const lockedModal = createRef<any>();
    const keystore = useKeystore();
    const { soulWalletLib } = useLib();

    const getAccount = async () => {
        const res = await keystore.getAddress();
        const wAddress = await getLocalStorage("walletAddress");
        setAccount(res);
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
                const paymasterAndData = await signModal.current.show(operation, actionName, "Soul Wallet", false);

                operation.paymasterAndData = paymasterAndData ? paymasterAndData : "0x";

                // if it's activate wallet, and user would like to approve first
                if (actionName === "Activate Wallet") {
                    const approveData: any = [
                        {
                            token: config.tokens.usdc,
                            spender: config.contracts.paymaster,
                        },
                    ];
                    const approveCallData = await soulWalletLib.Tokens.ERC20.getApproveCallData(
                        ethersProvider,
                        walletAddress,
                        approveData,
                    );

                    operation.callGasLimit = approveCallData.callGasLimit;
                    operation.callData = approveCallData.callData;
                }

                const userOpHash = operation.getUserOpHash(config.contracts.entryPoint, config.chainId);

                const signature = await keystore.sign(userOpHash);

                if (!signature) {
                    throw new Error("Failed to sign");
                }

                operation.signWithSignature(account, signature || "");

                await Runtime.send("execute", {
                    actionName,
                    operation: operation.toJSON(),
                    userOpHash,
                    bundlerUrl,
                });
            } catch (err) {
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
        const res = await keystore.checkLocked();
        if (res) {
            await lockedModal.current.show();
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
        // important todo, this doesn't work
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
            {children}
            <SignTransaction ref={signModal} />
            <Locked ref={lockedModal} />
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
