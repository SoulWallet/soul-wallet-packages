import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import useLib from "@src/hooks/useLib";
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
    const { soulWalletLib } = useLib();
    const signModal = createRef<any>();
    const keystore = useKeystore();

    const formatOperation: any = async () => {
        const { data, from, to, value } = searchParams;

        let fromAddress: any = ethers.utils.getAddress(from);

        const nonce = await soulWalletLib.Utils.getNonce(from, ethersProvider);

        try {
            const rawTxs = [
                {
                    data: data,
                    from: fromAddress,
                    // gas,
                    to,
                    value,
                },
            ];

            let fee: any = (await soulWalletLib.Utils.suggestedGasFee.getEIP1559GasFees(config.chainId))?.medium;

            const maxFeePerGas = ethers.utils
                .parseUnits(Number(fee.suggestedMaxFeePerGas).toFixed(9), "gwei")
                .toString();
            const maxPriorityFeePerGas = ethers.utils
                .parseUnits(Number(fee.suggestedMaxPriorityFeePerGas).toFixed(9), "gwei")
                .toString();

            const operation: any = await soulWalletLib.Utils.fromTransaction(
                ethersProvider,
                config.contracts.entryPoint,
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
        const { actionType, origin, tabId } = searchParams;

        console.log("tab id is", tabId);

        console.log("determine action", searchParams);

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
            console.log("why why");
            try {
                const operation = await formatOperation();

                const paymasterAndData = await signModal.current.show(operation, actionType, origin, true);

                if (paymasterAndData) {
                    operation.paymasterAndData = paymasterAndData;
                }

                const userOpHash = operation.getUserOpHash(config.contracts.entryPoint, config.chainId);

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

                window.close();
            } catch (err) {
                console.log(err);
            } finally {
                // window.close();
            }
        }
    };

    useEffect(() => {
        if (!searchParams.actionType || !signModal || !signModal.current || !walletAddress) {
            return;
        }
        determineAction();
    }, [searchParams.actionType, signModal, walletAddress]);

    return (
        <div>
            {/* <img src={LogoLoading} /> */}
            <SignTransaction ref={signModal} />
        </div>
    );
}
