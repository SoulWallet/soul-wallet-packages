import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import useLib from "@src/hooks/useLib";
import LogoLoading from "@src/assets/logo-loading.gif";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useKeystore from "@src/hooks/useKeystore";
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
    const keystore = useKeystore();

    const signUserTx: any = async () => {
        const { tabId, data, from, to, value, gas, maxFeePerGas, maxPriorityFeePerGas } = searchParams;

        let fromAddress: any = ethers.utils.getAddress(from);

        const nonce = await soulWalletLib.Utils.getNonce(from, ethersProvider);

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

            const userOpHash = operation.getUserOpHash(config.contracts.entryPoint, config.chainId);

            console.log("OPPPPP hash", userOpHash);

            const signature = await keystore.sign(userOpHash);

            console.log("SIG", signature);

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
        const { actionType, origin } = searchParams;

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
            try {
                const { tabId, operation, userOpHash } = await signUserTx();

                const paymasterAndData = await signModal.current.show(operation, actionType, origin, true);

                if (paymasterAndData) {
                    operation.paymasterAndData = paymasterAndData;
                }

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "approveTransaction",
                    tabId: searchParams.tabId,
                    data: {
                        operation: operation.toJSON(),
                        userOpHash,
                        tabId,
                    },
                });
            } catch (err) {
                console.log(err);
            } finally {
                // window.close();
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
            {/** TODO, add loading here */}
            <img src={LogoLoading} />
            <SignTransaction ref={signModal} />
        </div>
    );
}
