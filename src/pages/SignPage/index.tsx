import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import useLib from "@src/hooks/useLib";
import useQuery from "@src/hooks/useQuery";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useKeystore from "@src/hooks/useKeystore";
import { useSearchParams } from "react-router-dom";
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
    const keystore = useKeystore();

    const formatOperation: any = async () => {
        const { data, from, to, value, gas } = searchParams;

        let fromAddress: any = ethers.utils.getAddress(from);

        const nonce = await soulWalletLib.Utils.getNonce(from, ethersProvider);

        try {
            const rawTxs = [
                {
                    data: data,
                    from: fromAddress,
                    gasLimit: gas,
                    to,
                    value,
                },
            ];

            const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

            const operation: any = soulWalletLib.Utils.fromTransaction(
                rawTxs,
                nonce,
                maxFeePerGas,
                maxPriorityFeePerGas,
            );

            if (!operation) {
                throw new Error("Failed to format tx");
            }

            return operation;
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

                await currentSignModal.show("", actionType, origin, true, data);

                const signature = await keystore.signMessage(data);

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

                console.log('sig na', signature)

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
            // window.close();
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
