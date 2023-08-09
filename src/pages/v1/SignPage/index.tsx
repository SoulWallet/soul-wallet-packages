import React, { createRef, useEffect, useState } from "react";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getMessageType } from "@src/lib/tools";
import useQuery from "@src/hooks/useQuery";
import useKeyring from "@src/hooks/useKeyring";
import { useToast } from "@chakra-ui/react";
import { useSearchParams } from "react-router-dom";
import useSdk from "@src/hooks/useSdk";
import SignTransaction from "@src/components/SignTransaction";
import useWallet from "@src/hooks/useWallet";
import useBrowser from "@src/hooks/useBrowser";
import { useSettingStore } from "@src/store/settingStore";
import { useAddressStore } from "@src/store/address";

export default function SignPage() {
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { selectedAddress } = useAddressStore();
    const toast = useToast();
    const { getGasPrice } = useQuery();
    const { directSignAndSend } = useWallet();
    const { navigate } = useBrowser();
    const signModal = createRef<any>();
    const keyring = useKeyring();

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
        // IMPORTANT TODO, move to store to manage
        // let prev = (await getLocalStorage("accountsAllowed")) || {};
        // if (prev[walletAddress] && prev[walletAddress].length > 0) {
        //     prev[walletAddress] = [...prev[walletAddress], origin];
        // } else {
        //     prev[walletAddress] = [origin];
        // }
        // await setLocalStorage("accountsAllowed", prev);
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
                    data: selectedAddress,
                    tabId: searchParams.tabId,
                });
            } else if (actionType === "approveTransaction") {
                // IMPORTANT TODO, move to signModal
                // const userOp = formatOperation();
                const { txns } = searchParams;

                const userOp = await currentSignModal.show(txns, actionType, origin, true);

                // if (paymasterAndData) {
                //     userOp.paymasterAndData = paymasterAndData;
                // }

                await directSignAndSend(userOp);

                // if from dapp, return trsanction result
                if (tabId) {
                    await browser.runtime.sendMessage({
                        target: "soul",
                        type: "response",
                        action: "approveTransaction",
                        tabId: searchParams.tabId,
                        data: {
                            operation: JSON.stringify(userOp),
                            tabId,
                            bundlerUrl: config.defaultBundlerUrl,
                        },
                    });
                    window.close();
                } else {
                    // if internal tx, return to wallet page
                    toast({
                        title: "Transaction sent.",
                        status: "success",
                    });

                    navigate("wallet");
                }
            } else if (actionType === "signMessage") {
                const msgToSign = getMessageType(data) === "hash" ? data : ethers.toUtf8String(data);

                await currentSignModal.show("", actionType, origin, true, msgToSign);

                const signature = await keyring.signMessage(msgToSign);

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "signMessage",
                    data: signature,
                    tabId: searchParams.tabId,
                });

                window.close();
            } else if (actionType === "signMessageV4") {
                const parsedData = JSON.parse(data);

                await currentSignModal.show("", actionType, origin, true, data);

                const signature = await keyring.signMessageV4(parsedData);

                console.log("v4 signature", signature);

                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "signMessageV4",
                    data: signature,
                    tabId: searchParams.tabId,
                });

                window.close();
            }
        } catch (err) {
            console.log(err);
        } finally {
            if (tabId) {
                window.close();
            } else {
                navigate("wallet");
            }
        }
    };

    useEffect(() => {
        const current = signModal.current;
        if (!searchParams.actionType || !current || !selectedAddress) {
            return;
        }
        console.log("changed", searchParams.actionType, current);
        determineAction();
    }, [searchParams.actionType, signModal.current, selectedAddress]);

    return (
        <div>
            {/* <img src={LogoLoading} /> */}
            <SignTransaction ref={signModal} />
        </div>
    );
}
