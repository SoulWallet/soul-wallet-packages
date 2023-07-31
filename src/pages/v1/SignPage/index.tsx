import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, setLocalStorage, getMessageType } from "@src/lib/tools";
import useLib from "@src/hooks/useLib";
import useQuery from "@src/hooks/useQuery";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useKeyring from "@src/hooks/useKeyring";
import { useSearchParams } from "react-router-dom";
import useSoulWallet from "@src/hooks/useSoulWallet";
import SignTransaction from "@src/components/SignTransaction";
import { useSettingStore } from "@src/store/settingStore";

export default function SignPage() {
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { walletAddress, ethersProvider, account } = useWalletContext();
    const { bundlerUrl } = useSettingStore();
    const { getGasPrice, estimateUserOperationGas } = useQuery();
    const { soulWalletLib } = useLib();
    const signModal = createRef<any>();
    const keystore = useKeyring();

    const formatOperation: any = async () => {
        const { txns } = searchParams;

        try {
            const rawTxs = JSON.parse(txns);

            // const nonce = await soulWalletLib.Utils.getNonce(rawTxs[0].from, ethersProvider);

            // const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

            // const operation: any = soulWalletLib.Utils.fromTransaction(
            //     rawTxs,
            //     nonce,
            //     maxFeePerGas,
            //     maxPriorityFeePerGas,
            // );

            // if (!operation) {
            //     throw new Error("Failed to format tx");
            // }

            // return operation;
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
            txns: param.get("txns"),
            data: param.get("data"),
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
        const { actionType, origin, tabId, data } = searchParams;

        const currentSignModal = signModal.current;

        if (!currentSignModal) {
            console.log("no modal detected");
            return;
        }

        try {
            // TODO, 1. need to check if account is locked.
            if (actionType === "getAccounts") {
                await currentSignModal.show("", actionType, origin, true);
                await saveAccountsAllowed(searchParams.origin || "");
                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId: searchParams.tabId,
                });
            } else if (actionType === "approveTransaction") {
                // IMPORTANT TODO, move to signModal
                const operation = await formatOperation();

                const paymasterAndData = await currentSignModal.show(operation, actionType, origin, true);

                if (paymasterAndData) {
                    operation.paymasterAndData = paymasterAndData;
                }

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

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "approveTransaction",
                    tabId: searchParams.tabId,
                    data: {
                        operation: operation.toJSON(),
                        userOpHash,
                        tabId,
                        bundlerUrl,
                    },
                });
            } else if (actionType === "signMessage") {

                const msgToSign = getMessageType(data) === "hash" ? data : ethers.toUtf8String(data);

                await currentSignModal.show("", actionType, origin, true, msgToSign);

                const signature = await keystore.signMessage(msgToSign);

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "signMessage",
                    data: signature,
                    tabId: searchParams.tabId,
                });
            } else if (actionType === "signMessageV4") {
                const parsedData = JSON.parse(data);

                await currentSignModal.show("", actionType, origin, true, data);

                const signature = await keystore.signMessageV4(parsedData);

                console.log("v4 signature", signature);

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "signMessageV4",
                    data: signature,
                    tabId: searchParams.tabId,
                });
            }
        } catch (err) {
            console.log(err);
        } finally {
            window.close();
        }
    };

    useEffect(() => {
        const current = signModal.current;
        if (!searchParams.actionType || !current || !walletAddress) {
            return;
        }
        console.log("changed", searchParams.actionType, current);
        determineAction();
    }, [searchParams.actionType, signModal.current, walletAddress]);

    return (
        <div>
            {/* <img src={LogoLoading} /> */}
            <SignTransaction ref={signModal} />
        </div>
    );
}
