import React, { createRef, useEffect, useState } from "react";
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
    const { walletAddress, executeOperation, web3 } = useWalletContext();
    const signModal = createRef<any>();

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
        // TODO, 1. need to check if account is locked.
        if (searchParams.actionType === "getAccounts") {
            try {
                await signModal.current.show("", searchParams.actionType);
                await saveAccountsAllowed(searchParams.origin || "");
                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId: searchParams.tabId,
                });
                window.close();
            } catch (err) {
                console.log(err);
                window.close();
            }
        } else if (searchParams.actionType === "approveTransaction") {
            try {
                await signModal.current.show("", searchParams.actionType);
                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "approveTransaction",
                    tabId: searchParams.tabId,
                });
                // execute action
                window.close();
            } catch (err) {
                console.log(err);
                window.close();
            }
        } else if (searchParams.actionType === "signTransaction") {
            // TODO, move this to background
            try {
                const nonce = await WalletLib.EIP4337.Utils.getNonce(
                    walletAddress,
                    web3,
                );

                const {
                    data,
                    gas,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                    from,
                    to,
                    value,
                } = searchParams;

                // create op
                const op = WalletLib.EIP4337.Utils.fromTransaction(
                    {
                        data,
                        from,
                        gas,
                        to,
                        value,
                    },
                    nonce,
                    maxFeePerGas,
                    maxPriorityFeePerGas,
                    config.contracts.paymaster,
                );

                await executeOperation(op, "", searchParams.tabId);
            } catch (err) {
                console.log("sign tx error", err);
            }
        }
    };

    useEffect(() => {
        if (!searchParams.actionType || !signModal.current || !walletAddress) {
            return;
        }
        determineAction();
    }, [searchParams.actionType, signModal, walletAddress]);

    return (
        <div>
            <SignTransaction ref={signModal} />
        </div>
    );
}
