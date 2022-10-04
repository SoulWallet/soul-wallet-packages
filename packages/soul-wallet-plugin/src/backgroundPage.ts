import browser from "webextension-polyfill";

chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.type) {
        case "sign":
            browser.windows.create({
                url: msg.url,
                type: "popup",
                ...msg.pos,
            });
            break;
        case "notify":
            const notifyId = Math.ceil(Math.random() * 1000).toString();
            browser.notifications.create(notifyId, {
                type: "basic",
                iconUrl: "../icon-48.png",
                title: "Trsanction submitted",
                message: "Please wait a moment...",
            });
            break;
    }
});

// check if there's transaction in queue
// setInterval(() => {

// }, 5000);
