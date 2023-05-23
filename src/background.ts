// @ts-nocheck
import browser from "webextension-polyfill";
import { getLocalStorage, openWindow } from "@src/lib/tools";
import { UserOperation } from "soul-wallet-lib";
import { executeTransaction } from "@src/lib/tx";

browser.runtime.onMessage.addListener(async (msg, sender) => {
    // get current active tab
    // const [tab] = await browser.tabs.query({
    //     active: true,
    //     currentWindow: true,
    // });

    const senderTabId = sender.tab?.id;
    const windowWidth = sender.tab?.width;

    switch (msg.type) {
        case "response":
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;
        case "getAccounts":
            // if already allowed getting accounts, don't show popup
            const walletAddress = await getLocalStorage("walletAddress");
            const accountsAllowed = (await getLocalStorage("accountsAllowed")) || {};

            // IMPORTANT TODO, also need to check lock state
            if (accountsAllowed[walletAddress] && accountsAllowed[walletAddress].includes(msg.data.origin)) {
                browser.tabs.sendMessage(Number(senderTabId), {
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId: senderTabId,
                });
            } else {
                openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}`, windowWidth);
            }

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

            openWindow(
                `${msg.url}&tabId=${senderTabId}&origin=${origin}&txns=${JSON.stringify(txns)}`,
                windowWidth,
            );

            break;

        case "signMessage":
            openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}`, windowWidth);
            break;

        case "signMessageV4":
            openWindow(`${msg.url}&tabId=${senderTabId}&origin=${msg.data.origin}&data=${msg.data.data}`, windowWidth);
            break;

        case "execute":
            const { operation, userOpHash, tabId, bundlerUrl } = msg.data;

            const parsedOperation = UserOperation.fromJSON(operation);

            await executeTransaction(parsedOperation, tabId, bundlerUrl);

            browser.runtime.sendMessage({
                target: "soul",
                data: userOpHash,
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
