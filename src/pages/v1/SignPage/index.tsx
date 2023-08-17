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
import { UserOpUtils } from "@soulwallet/sdk";
import { useChainStore } from "@src/store/chain";

export default function SignPage() {
    const { getSelectedChainItem } = useChainStore();
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { selectedAddress, toggleAllowedOrigin } = useAddressStore();
    const toast = useToast();
    const { signAndSend } = useWallet();
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
            sendTo: param.get("sendTo"),
        });
    }, [params[0]]);

    /**
     * Determine what data user want
     */
    const determineAction = async () => {
        const { actionType, origin, tabId, data, sendTo } = searchParams;

        const currentSignModal = signModal.current;

        if (!currentSignModal) {
            console.log("no modal detected");
            return;
        }

        try {
            // TODO, 1. need to check if account is locked.
            if (actionType === "getAccounts") {
                await currentSignModal.show({ txns: "", actionType, origin, keepVisible: true });
                toggleAllowedOrigin(selectedAddress, origin, true);
                await browser.runtime.sendMessage({
                    type: "response",
                    action: "getAccounts",
                    data: selectedAddress,
                    tabId: searchParams.tabId,
                });
            } else if (actionType === "approveTransaction") {
                // IMPORTANT TODO, move to signModal
                // const userOp = formatOperation();
                const { txns } = searchParams;

                const { userOp, payToken } = await currentSignModal.show({
                    txns,
                    actionType,
                    origin,
                    keepVisible: true,
                    sendTo,
                });

                console.log("signAndSend tab id", tabId);

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

                // if (tabId) {
                //     console.log('ready to send bg', '???????????')
                //     await browser.runtime.sendMessage({
                //         type: "response",
                //         action: "approveTransaction",
                //         tabId: searchParams.tabId,
                //         data: {
                //             operation: UserOpUtils.userOperationToJSON(userOp),
                //             tabId,
                //             bundlerUrl: bundlerUrl,
                //         },
                //     });
                //     window.close();
                // } else {
                //     // if internal tx, return to wallet page
                //     toast({
                //         title: "Transaction sent.",
                //         status: "success",
                //     });

                //     navigate("wallet");
                // }
            } else if (actionType === "signMessage") {
                const msgToSign = getMessageType(data) === "hash" ? data : ethers.toUtf8String(data);

                await currentSignModal.show({ txns: "", actionType, origin, keepVisible: true, msgToSign });

                const signature = await keyring.signMessage(msgToSign);

                await browser.runtime.sendMessage({
                    type: "response",
                    action: "signMessage",
                    data: signature,
                    tabId: searchParams.tabId,
                });

                window.close();
            } else if (actionType === "signMessageV4") {
                const parsedData = JSON.parse(data);

                await currentSignModal.show({ txns: "", actionType, origin, keepVisible: true, msgToSign: data });

                const signature = await keyring.signMessageV4(parsedData);

                console.log("v4 signature", signature);

                await browser.runtime.sendMessage({
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
