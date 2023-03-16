// @ts-nocheck
/**
 * @notice
 * 1. web3.js is not compatiable with service worker
 *
 */

import browser from "webextension-polyfill";
import { getLocalStorage, notify } from "@src/lib/tools";
import { UserOperation } from "soul-wallet-lib";
import { executeTransaction } from "@src/lib/tx";

browser.runtime.onMessage.addListener(async (msg) => {
    // get current active tab
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    switch (msg.type) {
        case "response":
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;
        case "getAccounts":
            // if already allowed getting accounts, don't show popup
            const walletAddress = await getLocalStorage("walletAddress");
            const accountsAllowed = (await getLocalStorage("accountsAllowed")) || {};

            if (accountsAllowed[walletAddress] && accountsAllowed[walletAddress].includes(msg.data.origin)) {
                browser.tabs.sendMessage(Number(tab.id), {
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId: tab.id,
                });
            } else {
                // if user never allowed access
                browser.windows.create({
                    url: `${msg.url}&tabId=${tab.id}&origin=${msg.data.origin}`,
                    type: "popup",
                    ...msg.pos,
                });
            }

            break;
        case "approve":
            const { origin, data, from, to, value, gas, maxFeePerGas, maxPriorityFeePerGas } = msg.data;

            browser.windows.create({
                url: `${msg.url}&tabId=${tab.id}&origin=${origin}&data=${data}&from=${from}&to=${to}&value=${value}&gas=${gas}&maxFeePerGas=${maxFeePerGas}&maxPriorityFeePerGas=${maxPriorityFeePerGas}`,
                type: "popup",
                ...msg.pos,
            });
            break;

        case "signMessage":
            browser.windows.create({
                url: `${msg.url}&tabId=${tab.id}&origin=${msg.data.origin}&data=${msg.data.data}`,
                type: "popup",
                ...msg.pos,
            });
            break;

        case "signMessageV4":
            browser.windows.create({
                url: `${msg.url}&tabId=${tab.id}&origin=${msg.data.origin}&data=${msg.data.data}`,
                type: "popup",
                ...msg.pos,
            });
            break;

        case "execute":
            const { operation, userOpHash, tabId, bundlerUrl } = msg.data;

            const parsedOperation = UserOperation.fromJSON(operation);

            await executeTransaction(parsedOperation, tabId, bundlerUrl);

            // send msg back
            browser.runtime.sendMessage({
                target: "soul",
                data: userOpHash,
            });
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
                url: browser.runtime.getURL("popup.html#/launch?mode=web"),
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
