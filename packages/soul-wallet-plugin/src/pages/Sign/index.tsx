import React, { createRef, useEffect } from "react";
import browser from "webextension-polyfill";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { useSearchParams } from "react-router-dom";
import SignTransaction from "@src/components/SignTransaction";

export default function Sign() {
    const params = useSearchParams();
    const { walletAddress } = useWalletContext();
    const actionType = params[0].get("action");
    const tabId = params[0].get("tabId");
    const signModal = createRef<any>();

    /**
     * Determine what data user want
     */
    const determineAction = async () => {
        // TODO, need to check if account is locked.
        if (actionType === "getAccounts") {
            try {
                console.log('sign modal', signModal.current)
                await signModal.current.show("", actionType);
                await browser.runtime.sendMessage({
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId,
                });
                window.close();
            } catch (err) {
                console.log(err)
                console.log("1111user rejected");
                window.close();

            }
        }
    };

    useEffect(() => {
        if (!actionType || !signModal.current || !walletAddress) {
            return;
        }
        determineAction();
    }, [actionType, signModal, walletAddress]);

    return (
        <div>
            <SignTransaction ref={signModal} />
        </div>
    );
}
