import browser from "webextension-polyfill";

// Listen for messages sent from other parts of the extension
// browser.runtime.onMessage.addListener((request: { popupMounted: boolean }) => {
//     // Log statement if request.popupMounted is true
//     // NOTE: this request is sent in `popup/component.tsx`
//     console.log("Req is", request);
//     if (request.popupMounted) {
//         console.log("backgroundPage notified that Popup.tsx has mounted.");
//     }
// });

// chrome.tabs.onRemoved.addListener(function (tabid, removed) {
//     chrome.storage.local.remove("pw");
// });

chrome.runtime.onMessage.addListener((msg) => {
    switch (msg.type) {
        case "sign":
            chrome.tabs.create({ url: "popup.html" });
            break;
    }
});
