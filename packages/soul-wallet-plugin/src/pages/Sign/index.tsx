import React, { createRef, useEffect, useState } from "react";
import browser from "webextension-polyfill";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { useSearchParams } from "react-router-dom";
import SignTransaction from "@src/components/SignTransaction";

export default function Sign() {
    const params = useSearchParams();
    const [searchParams, setSearchParams] = useState<any>({});
    const { walletAddress } = useWalletContext();
    const signModal = createRef<any>();

    useEffect(() => {
        const param = params[0];
        setSearchParams({
            actionType: param.get("action"),
            tabId: param.get("tabId"),
            origin: param.get("origin"),
            data: param.get("data"),
            to: param.get("to"),
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
                console.log("ready to execute", searchParams);
                // execute action
                window.close();
            } catch (err) {
                console.log(err);
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

    return (
        <div>
            <SignTransaction ref={signModal} />
        </div>
    );
}
