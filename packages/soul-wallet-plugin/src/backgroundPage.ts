import browser from "webextension-polyfill";

browser.runtime.onMessage.addListener(async(msg) => {
    switch (msg.type) {
        case "response":
            console.log('response tab id', msg)
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;
        case "sign":
            const [tab] = await browser.tabs.query({active: true, currentWindow: true});
            browser.windows.create({
                url: `${msg.url}&tabId=${tab.id}`,
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
