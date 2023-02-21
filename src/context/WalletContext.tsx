import React, { createContext, useState, useEffect, createRef } from "react";
import Web3 from "web3";
import Runtime from "@src/lib/Runtime";
import { setLocalStorage } from "@src/lib/tools";
import { ethers } from "ethers";
import useKeystore from "@src/hooks/useKeystore";
import { useSettingStore } from "@src/store/settingStore";
import SignTransaction from "@src/components/SignTransaction";
import config from "@src/config";
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
    const bundlerUrl = useSettingStore((state: any) => state.bundlerUrl);
    const [account, setAccount] = useState<string>("");
    const [walletAddress, setWalletAddress] = useState<string>("");
    const [walletType, setWalletType] = useState<string>("");
    const signModal = createRef<any>();
    const keyStore = useKeystore();
    const { calculateWalletAddress } = useWallet();
    const { soulWalletLib } = useLib();

    const getAccount = async () => {
        const res = await keyStore.getAddress();
        setAccount(res);
        const wAddress = calculateWalletAddress(res);
        setWalletAddress(wAddress);
        setLocalStorage("activeWalletAddress", wAddress);
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

                // if user want to pay with paymaster
                if (paymasterAndData) {
                    operation.paymasterAndData = paymasterAndData;

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
                        operation.callData = approveCallData.callData;
                        operation.callGasLimit = approveCallData.callGasLimit;
                    }
                }

                const userOpHash = operation.getUserOpHash(config.contracts.entryPoint, config.chainId);

                const signature = await keyStore.sign(userOpHash);

                if (signature) {
                    operation.signWithSignature(account, signature || "");

                    await Runtime.send("execute", {
                        actionName,
                        operation: operation.toJSON(),
                        userOpHash,
                        bundlerUrl,
                    });
                }
            } catch (err) {
                throw Error("User rejected");
            }
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
