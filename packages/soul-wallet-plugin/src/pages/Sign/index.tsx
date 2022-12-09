import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { WalletLib } from "soul-wallet-lib";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { useSearchParams } from "react-router-dom";
import SignTransaction from "@src/components/SignTransaction";

export default function Sign() {
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { walletAddress, ethersProvider, signTransaction, account } =
        useWalletContext();
    const signModal = createRef<any>();

    const signUserTx: any = async () => {
        const {
            tabId,
            data,
            from,
            to,
            value,
            gas,
            maxFeePerGas,
            maxPriorityFeePerGas,
        } = searchParams;

        let fromAddress: any = ethers.utils.getAddress(from);

        const nonce = await WalletLib.EIP4337.Utils.getNonce(
            fromAddress,
            ethersProvider,
        );
        try {
            const operation: any =
                await WalletLib.EIP4337.Utils.fromTransaction(
                    ethersProvider,
                    config.contracts.entryPoint,
                    {
                        data: data,
                        from: fromAddress,
                        gas,
                        to,
                        value,
                    },
                    nonce,
                    parseInt(maxFeePerGas),
                    parseInt(maxPriorityFeePerGas),
                    // parseInt(ethers.utils.parseUnits("30", 9).toString()),
                    // parseInt(ethers.utils.parseUnits("2", 9).toString()),
                    config.contracts.paymaster,
                );

            if (!operation) {
                throw new Error("Failed to format tx");
            }

            const requestId = operation.getRequestId(
                config.contracts.entryPoint,
                config.chainId,
            );

            console.log("r id", requestId);

            // TODO, this function should be renamed
            const signature = await signTransaction(requestId);

            console.log("signature", signature);

            if (!signature) {
                return;
            }

            operation.signWithSignature(account, signature || "");

            return {
                tabId,
                operation,
                requestId,
            };
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        const param = params[0];
        setSearchParams({
            actionType: param.get("action"),
            tabId: param.get("tabId"),
            origin: param.get("origin"),
            data: param.get("data"),
            from: param.get("from"),
            to: param.get("to"),
            value: param.get("value"),
            gas: param.get("gas"),
            maxFeePerGas: param.get("maxFeePerGas"),
            maxPriorityFeePerGas: param.get("maxPriorityFeePerGas"),
        });
    }, [params[0]]);

    const saveAccountsAllowed = async (origin: string) => {
        let prev = (await getLocalStorage("accountsAllowed")) || {};

        if (prev[walletAddress] && prev[walletAddress].length > 0) {
            prev[walletAddress] = [...prev[walletAddress], origin];
        } else {
            prev[walletAddress] = [origin];
        }

        await setLocalStorage("accountsAllowed", prev);
    };

    /**
     * Determine what data user want
     */
    const determineAction = async () => {
        const { actionType, origin } = searchParams;

        // TODO, 1. need to check if account is locked.
        if (actionType === "getAccounts") {
            try {
                await signModal.current.show("", actionType, origin, true);
                await saveAccountsAllowed(searchParams.origin || "");
                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId: searchParams.tabId,
                });
            } catch (err) {
                console.log(err);
            } finally {
                window.close();
            }
        } else if (actionType === "approveTransaction") {
            try {
                // format signature of userOP

                await signModal.current.show("", actionType, origin, true);

                const { operation, requestId, tabId } = await signUserTx();

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "approveTransaction",
                    tabId: searchParams.tabId,
                    data: {
                        operation: JSON.stringify(operation),
                        requestId,
                        tabId,
                    },
                });
            } catch (err) {
                console.log(err);
            } finally {
                window.close();
            }
        }
    };

    useEffect(() => {
        if (!searchParams.actionType || !signModal.current || !walletAddress) {
            return;
        }
        determineAction();
    }, [searchParams.actionType, signModal, walletAddress]);

    return <SignTransaction ref={signModal} />;
}
