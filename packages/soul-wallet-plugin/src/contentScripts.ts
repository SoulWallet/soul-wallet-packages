// @ts-nocheck
console.log("Content script in!");
import browser from 'webextension-polyfill'

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
chrome.runtime.onMessage.addListener((msg) => {
    console.log('msg is', msg.type)
    switch (msg.type) {
        case "sign":
            chrome.tabs.create({ url: "popup.html" });
            break;
    }
});

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

function injectScript(file, node) {
    console.log('file is', file)
    var th = document.getElementsByTagName(node)[0];
    var s = document.createElement('script');
    s.setAttribute('type', 'text/javascript');
    s.setAttribute('src', file);
    th.appendChild(s);
}
injectScript( browser.runtime.getURL('inject.js'), 'body');