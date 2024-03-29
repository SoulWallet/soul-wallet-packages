// @ts-nocheck
import browser from "webextension-polyfill";
import { getLocalStorage, openWindow, checkAllowed, checkShouldInject, getSelectedChainItem } from "@src/lib/tools";
import { executeTransaction } from "@src/lib/tx";
import { UserOpUtils } from "@soulwallet/sdk";
import bgBus from "./lib/bgBus";
import { notify } from "@src/lib/tools";

let password = null;

browser.runtime.onMessage.addListener(async (msg, sender) => {
    console.log("BG msg", msg);
    const senderTabId = sender.tab?.id;
    const windowWidth = sender.tab?.width;
    const { id } = msg;

    switch (msg.type) {
        // send UserOP to bundler
        case "execute":
            const { userOp, tabId, chainConfig: chainConfig2 } = msg.data;
            const receipt = await executeTransaction(UserOpUtils.userOperationFromJSON(userOp), chainConfig2);
            notify("Transaction success", "Your transaction was confirmed on chain");

            if (tabId) {
                //return to dapp
                browser.tabs.sendMessage(Number(tabId), {
                    id,
                    tabId,
                    isResponse: true,
                    data: receipt.hash,
                });
            } else {
                // return to popup
                bgBus.resolve(id, receipt);
            }
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
            const { isAllowed, selectedAddress } = checkAllowed(msg.data.origin);

            if (isAllowed) {
                browser.tabs.sendMessage(Number(senderTabId), {
                    id,
                    isResponse: true,
                    action: "getAccounts",
                    data: selectedAddress,
                    tabId: senderTabId,
                });
            } else {
                openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&id=${id}`, windowWidth);
            }
            break;
        
        case "switchChain":
            console.log('Swith chain msg', msg);
            const targetChainId = msg.data.chainId
            openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&id=${id}&targetChainId=${targetChainId}`, windowWidth);
            break;

        case "getChainConfig":
            const chainConfig = getSelectedChainItem();
            console.log("SO you see", chainConfig)
            browser.tabs.sendMessage(Number(senderTabId), {
                id,
                isResponse: true,
                action: "getChainConfig",
                data: chainConfig,
                tabId: senderTabId,
            });
            break;

        case "shouldInject":
            const shouldInject = checkShouldInject(msg.data.origin);
            await browser.tabs.sendMessage(Number(senderTabId), {
                id,
                isResponse: true,
                action: "shouldInject",
                data: shouldInject,
                tabId: senderTabId,
            });
            break;

        case "approve":
            const { origin, txns } = msg.data;

            console.log("BEFORE APPROVE ID IS", id)
            openWindow(
                `${msg.url}&tabId=${senderTabId}&origin=${origin}&txns=${JSON.stringify(txns)}&id=${id}`,
                windowWidth,
            );

            break;

        case "signMessage":
            openWindow(
                `${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}&id=${id}`,
                windowWidth,
            );
            break;

        case "signMessageV4":
            openWindow(
                `${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}&id=${id}`,
                windowWidth,
            );
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
