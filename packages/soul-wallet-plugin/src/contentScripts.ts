// @ts-nocheck
console.log("Content script injected!");
import browser from "webextension-polyfill";

// function codeToInject() {
//     window.soul = {
//         isSoul: true,
//     };
// }

// function embed(fn) {
//     const script = document.createElement("script");
//     script.text = `(${fn.toString()})();`;
//     document.documentElement.appendChild(script);
// }

// embed(codeToInject);

// (function () {
//     function script() {
//         // your main code here
//         window.foo = "bar";
//     }

//     function inject(fn) {
//         const script = document.createElement("script");
//         script.text = `(${fn.toString()})();`;
//         document.documentElement.appendChild(script);
//     }

//     inject(script);
// })();

function sendMessage(data) {
    data.url = `chrome-extension://${chrome.runtime.id}/popup.html#/sign`;
    data.pos = {
        width: 320,
        height: 568 + 28, // 28 is title bar
        top: 0,
        left: window.screen.width - 320,
    };
    chrome.runtime.sendMessage(data);
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
        if (msg.data.target === "soul") {
            sendMessage(msg.data);
        }
    },
    false,
);
