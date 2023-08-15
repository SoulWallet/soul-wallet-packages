// @ts-nocheck
import browser from "webextension-polyfill";
import { getLocalStorage, openWindow, checkAllowed, getSelectedChainItem } from "@src/lib/tools";
import { executeTransaction } from "@src/lib/tx";
import { UserOpUtils } from "@soulwallet/sdk";
import bgBus from "./lib/bgBus";

// IMPORTANT TODO, maintain chainConfig here as well
let password = null;

browser.runtime.onMessage.addListener(async (msg, sender) => {
    console.log("BG msg", msg);
    const senderTabId = sender.tab?.id;
    const windowWidth = sender.tab?.width;

    switch (msg.type) {
        case "set/password":
            console.log("to set password", msg.data);
            password = msg.data;
            break;
        case "get/password":
            // TODO, remove timeout logic
            console.log("to get password", password);
            setTimeout(() => {
                bgBus.resolve(msg.id, password);
            }, 1);

            break;

        case "response":
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;
        case "getAccounts":
            // IMPORTANT TODO, also need to check lock state
            const { isAllowed, selectedAddress } = checkAllowed(msg.data.origin);

            if (isAllowed) {
                browser.tabs.sendMessage(Number(senderTabId), {
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: selectedAddress,
                    tabId: senderTabId,
                });
            } else {
                openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}`, windowWidth);
            }

            break;

        case "getChainConfig":
            const chainConfig = getSelectedChainItem();
            console.log("GET chain config", chainConfig);
            browser.tabs.sendMessage(Number(senderTabId), {
                target: "soul",
                type: "response",
                action: "getChainConfig",
                data: chainConfig,
                tabId: senderTabId,
            });
            break;

        case "shouldInject":
            const userAllowed = await getLocalStorage("shouldInject");

            await browser.tabs.sendMessage(Number(senderTabId), {
                target: "soul",
                type: "response",
                action: "shouldInject",
                data: userAllowed,
                tabId: senderTabId,
            });

            break;

        case "approve":
            const { origin, txns } = msg.data;

            openWindow(`${msg.url}&tabId=${senderTabId}&origin=${origin}&txns=${JSON.stringify(txns)}`, windowWidth);

            break;

        case "signMessage":
            openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}`, windowWidth);
            break;

        case "signMessageV4":
            openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}`, windowWidth);
            break;

        case "execute":
            const { userOp, tabId, chainName } = msg.data;

            await executeTransaction(UserOpUtils.userOperationFromJSON(userOp), tabId, chainName);

            await browser.runtime.sendMessage({
                target: "soul",
                data: userOp.hash,
            });
            break;
    }
});

/**
 * Detect install, update event
 */
browser.runtime.onInstalled.addListener((details) => {
    switch (details.reason) {
        case "install":
            // installed
            browser.tabs.create({
                url: browser.runtime.getURL("popup.html#/v1/launch?mode=web"),
            });
            break;
        case "update":
            // updated
            break;
    }
});

browser.runtime.onStartup.addListener((details) => {
    console.log("browser started", details);
});

browser.runtime.onSuspend.addListener((details) => {
    console.log("suspened", details);
});
