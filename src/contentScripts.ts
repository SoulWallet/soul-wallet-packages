// @ts-nocheck
import browser from "webextension-polyfill";
import windowBus from "./lib/windowBus";

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", file);
    th.insertBefore(s, th.children[0]);
}

injectScript(browser.runtime.getURL("js/inpage.js"), "html");

function sendMessage(data) {
    // todo, make version variable & judge target only from soul wallet
    if (typeof data === "object") {
        data.url = `chrome-extension://${browser.runtime.id}/popup.html#/v1/sign?action=${data.type}`;
        data.pos = {
            width: 360,
            height: 600 + 28, // 28 is title bar
            top: 0,
            left: window.screen.width - 360,
        };
    }

    browser.runtime.sendMessage(data);
}

// transfer msg from window to background
window.addEventListener(
    "message",
    (msg) => {
        if (!msg.data.isResponse) {
            sendMessage(msg.data);
        }
    },
    false,
);

// transfer msg from background to window
browser.runtime.onMessage.addListener((msg) => {
    console.log("ContentScript to resolve", msg);
    if (msg.isResponse) {
        windowBus.resolve(msg);
    }
});
