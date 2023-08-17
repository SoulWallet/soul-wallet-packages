// @ts-nocheck
import browser from "webextension-polyfill";
import { getLocalStorage, openWindow, checkAllowed, checkShouldInject, getSelectedChainItem } from "@src/lib/tools";
import { executeTransaction } from "@src/lib/tx";
import { UserOpUtils } from "@soulwallet/sdk";
import bgBus from "./lib/bgBus";
import { notify } from "@src/lib/tools";

// IMPORTANT TODO, maintain chainConfig here as well
let password = null;

browser.runtime.onMessage.addListener(async (msg, sender) => {
    console.log("BG msg", msg);
    const senderTabId = sender.tab?.id;
    const windowWidth = sender.tab?.width;
    const {id} = msg;

    switch (msg.type) {
        // send UserOP to bundler
        case "execute":
            const { userOp, tabId, chainConfig: chainConfig2 } = msg.data;
            const receipt = await executeTransaction(UserOpUtils.userOperationFromJSON(userOp), chainConfig2);
            notify("Transaction success", "Your transaction was confirmed on chain");

            if (tabId) {
                //return to dapp
                browser.tabs.sendMessage(Number(tabId), {
                    tabId,
                    isResponse: true,
                    action: "signTransaction",
                    data: receipt.hash,
                });
            } else {
                // return to popup
                bgBus.resolve(id, receipt);
            }
            break;
        case "response":
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;

        case "set/password":
            console.log("to set password", msg.data);
            password = msg.data;
            break;
        case "get/password":
            // TODO, remove timeout logic
            console.log("to get password", password);
            setTimeout(() => {
                bgBus.resolve(id, password);
            }, 1);
            break;

        case "getAccounts":
            // IMPORTANT TODO, also need to check lock state
            const { isAllowed, selectedAddress } = checkAllowed(msg.data.origin);

            if (isAllowed) {
                browser.tabs.sendMessage(Number(senderTabId), {
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
            browser.tabs.sendMessage(Number(senderTabId), {
                type: "response",
                action: "getChainConfig",
                data: chainConfig,
                tabId: senderTabId,
            });
            break;

        case "shouldInject":
            const shouldInject = checkShouldInject(msg.data.origin);

            await browser.tabs.sendMessage(Number(senderTabId), {
                type: "response",
                action: "shouldInject",
                data: shouldInject,
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
