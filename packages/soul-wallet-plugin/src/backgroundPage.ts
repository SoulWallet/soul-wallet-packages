import browser from "webextension-polyfill";
import { getLocalStorage } from "@src/lib/tools";

browser.runtime.onMessage.addListener(async (msg) => {
    // get current active tab
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    console.log("got tab id", tab.id);
    switch (msg.type) {
        case "response":
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;
        case "getAccounts":
            // if already allowed getting accounts, don't show popup
            const walletAddress = await getLocalStorage("activeWalletAddress");
            const accountsAllowed =
                (await getLocalStorage("accountsAllowed")) || {};

            if (
                accountsAllowed[walletAddress] &&
                accountsAllowed[walletAddress].includes(msg.data.origin)
            ) {
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
        case "sign":
            browser.windows.create({
                url: `${msg.url}&tabId=${tab.id}&origin=${msg.data.origin}&data=${msg.data.data}&to=${msg.data.to}`,
                type: "popup",
                ...msg.pos,
            });
            break;
        case "notify":
            const notifyId = Math.ceil(Math.random() * 1000).toString();
            browser.notifications.create(notifyId, {
                type: "basic",
                iconUrl: "../icon-48.png",
                title: "Trsanction success",
                message: "Your transaction was confirmed on chain",
            });
            break;
    }
});
