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
            // browser.notifications.create({

            // })
    }
});
