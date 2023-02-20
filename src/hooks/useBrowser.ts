import browser from "webextension-polyfill";

export default function useBrowser() {
    const openWallet = async () => {
        browser.windows.create({
            type: "popup",
            url: `chrome-extension://${browser.runtime.id}/popup.html#`,
            width: 360,
            height: 600 + 28, // 28 is title bar
            top: 0,
            left: window.screen.width - 360,
        });
    };

    return {
        openWallet,
    };
}
