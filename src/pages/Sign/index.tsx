import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import useLib from "@src/hooks/useLib";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { useSearchParams } from "react-router-dom";
import SignTransaction from "@src/components/SignTransaction";
import useTransaction from "@src/hooks/useTransaction";

export default function Sign() {
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { walletAddress, ethersProvider, account } = useWalletContext();
    const { signTransaction } = useTransaction();
    const { soulWalletLib } = useLib();
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

        const nonce = await soulWalletLib.Utils.getNonce(
            fromAddress,
            ethersProvider,
        );
        try {
            const operation: any = await soulWalletLib.Utils.fromTransaction(
                [
                    {
                        data: data,
                        from: fromAddress,
                        gas,
                        to,
                        value,
                    },
                ],
                nonce,
                parseInt(maxFeePerGas),
                parseInt(maxPriorityFeePerGas),
                config.contracts.paymaster,
            );

            if (!operation) {
                throw new Error("Failed to format tx");
            }

            const userOpHash = operation.getUserOpHash(
                config.contracts.entryPoint,
                config.chainId,
            );

            // TODO, this function should be renamed
            const signature = await signTransaction(userOpHash);

            console.log("signature", signature);

            if (!signature) {
                return;
            }

            operation.signWithSignature(account, signature || "");

            return {
                tabId,
                operation,
                userOpHash,
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
        console.log("s params", searchParams);
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

                const { operation, userOpHash, tabId } = await signUserTx();

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "approveTransaction",
                    tabId: searchParams.tabId,
                    data: {
                        operation: JSON.stringify(operation),
                        userOpHash,
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
