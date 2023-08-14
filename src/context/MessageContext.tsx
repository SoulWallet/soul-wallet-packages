/**
 * interact with background service
 */
import useConfig from "@src/hooks/useConfig";
import React, { useEffect } from "react";
import browser from "webextension-polyfill";
import bgBus from "@src/lib/bgBus";

export default function MessageContext({ children }: any) {
    const { selectedChainItem } = useConfig();

    const handleMessage = (msg: any, sender: any) => {
        console.log("react msg", msg, sender);
        if (msg.type === "get/chainConfig") {
            bgBus.resolve(msg.id, selectedChainItem);
        }
    };

    useEffect(() => {
        browser.runtime.onMessage.addListener(handleMessage);
        return () => {
            browser.runtime.onMessage.removeListener(handleMessage);
        };
    }, []);

    return <>{children}</>;
}
