// @ts-nocheck
import browser from "webextension-polyfill";

function injectScript(file, node) {
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement("script");
    s.setAttribute("type", "text/javascript");
    s.setAttribute("src", file);
    th.insertBefore(s, th.children[0]);
}

injectScript(browser.runtime.getURL("js/inpage.js"), "html");

function sendMessage(data) {
    // todo, make version variable
    data.url = `chrome-extension://${browser.runtime.id}/popup.html#/v1/sign?action=${data.action}`;
    data.pos = {
        width: 360,
        height: 600 + 28, // 28 is title bar
        top: 0,
        left: window.screen.width - 360,
    };
    browser.runtime.sendMessage(data);
}

// pass message to background
window.addEventListener(
    "message",
    (msg) => {
        console.log('CS msg', msg)
        if (msg.data.target === "soul" && msg.data.type !== "response") {
            sendMessage(msg.data);
        }
    },
    false,
);

//receive message from background
browser.runtime.onMessage.addListener((msg) => {
    console.log('CS runtime msg', msg)
    if (msg.target === "soul" && msg.type === "response") {
        msg.isResponse = true;
        window.postMessage(msg);
    }
});
