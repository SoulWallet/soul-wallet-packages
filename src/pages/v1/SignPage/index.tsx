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
import SignModal from "@src/components/SignModal";
import useWallet from "@src/hooks/useWallet";
import useBrowser from "@src/hooks/useBrowser";
import { useAddressStore } from "@src/store/address";

export default function SignPage() {
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { selectedAddress, toggleAllowedOrigin } = useAddressStore();
    const toast = useToast();
    const { signAndSend } = useWallet();
    const { navigate } = useBrowser();
    const signModal = createRef<any>();
    const keyring = useKeyring();

    console.log("sign page triggered", searchParams);

    useEffect(() => {
        const param = params[0];
        setSearchParams({
            actionType: param.get("action"),
            tabId: param.get("tabId"),
            origin: param.get("origin"),
            txns: param.get("txns"),
            data: param.get("data"),
            sendTo: param.get("sendTo"),
            id: param.get("id"),
        });
    }, [params[0]]);

    /**
     * Determine what data user want
     */
    const determineAction = async () => {
        const { actionType, origin, tabId, data, sendTo, id } = searchParams;

        const currentSignModal = signModal.current;

        if (!currentSignModal) {
            console.log("no modal detected");
            return;
        }

        try {
            // TODO, 1. need to check if account is locked.
            if (actionType === "getAccounts") {
                await currentSignModal.show({ txns: "", actionType, origin, keepVisible: false });
                toggleAllowedOrigin(selectedAddress, origin, true);
                console.log("getAccounts params", { id, isResponse: true, data: selectedAddress, tabId });
                await browser.tabs.sendMessage(Number(tabId), {
                    id,
                    isResponse: true,
                    data: selectedAddress,
                    tabId,
                });
                window.close();
            } else if (actionType === "approve") {
                // IMPORTANT TODO, move to signModal
                // const userOp = formatOperation();
                const { txns } = searchParams;

                const { userOp, payToken } = await currentSignModal.show({
                    txns,
                    actionType,
                    origin,
                    keepVisible: tabId ? false : true,
                    sendTo,
                });

                // if from dapp, return trsanction result
                if (tabId) {
                    await signAndSend(userOp, payToken, false, tabId);
                    window.close();
                } else {
                    await signAndSend(userOp, payToken, true, tabId);

                    toast({
                        title: "Transaction sent.",
                        status: "success",
                    });
                    navigate("wallet");
                }
            } else if (actionType === "signMessage") {
                const msgToSign = getMessageType(data) === "hash" ? data : ethers.toUtf8String(data);

                await currentSignModal.show({
                    txns: "",
                    actionType,
                    origin,
                    keepVisible: tabId ? false : true,
                    msgToSign,
                });

                const signature = await keyring.signMessage(msgToSign);

                await browser.tabs.sendMessage(Number(tabId), {
                    id,
                    isResponse: true,
                    // action: "signMessage",
                    data: signature,
                    tabId,
                });

                window.close();
            } else if (actionType === "signMessageV4") {
                const parsedData = JSON.parse(data);

                await currentSignModal.show({
                    txns: "",
                    actionType,
                    origin,
                    keepVisible: tabId ? false : true,
                    msgToSign: data,
                });

                const signature = await keyring.signMessageV4(parsedData);

                console.log("v4 signature", signature);

                await browser.tabs.sendMessage(Number(tabId), {
                    id,
                    isResponse: true,
                    // action: "signMessageV4",
                    data: signature,
                    tabId,
                });

                window.close();
            }
        } catch (err) {
            console.log(err);
        } finally {
            // if (tabId) {
            //     window.close();
            // } else {
            //     navigate("wallet");
            // }
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
            <SignModal ref={signModal} />
        </div>
    );
}
