// @ts-nocheck
import browser from "webextension-polyfill";

function sendMessage(data) {
    data.url = `chrome-extension://${browser.runtime.id}/popup.html#/sign?action=${data.action}`;
    data.pos = {
        width: 320,
        height: 568 + 28, // 28 is title bar
        top: 0,
        left: window.screen.width - 320,
    };
    browser.runtime.sendMessage(data);
}

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", file);
    th.appendChild(s);
}

injectScript(browser.runtime.getURL("js/inject.js"), "body");

// pass message to background
window.addEventListener(
    "message",
    (msg) => {
        if (msg.data.target === "soul" && msg.data.type !== "response") {
            sendMessage(msg.data);
        }
    },
    false,
);

browser.runtime.onMessage.addListener((msg) => {
    if (msg.target === "soul" && msg.type === "response") {
        window.postMessage(msg);
    }
});
