import browser from "webextension-polyfill";

export default function useBrowser() {
    const goPlugin = async () => {
        browser.windows.create({
            type: "popup",
            url: `chrome-extension://${browser.runtime.id}/popup.html#`,
            width: 360,
            height: 600 + 28, // 28 is title bar
            top: 0,
            left: window.screen.width - 360,
        });
    };

    const goWebsite = async (path = "/") => {
        browser.tabs.create({
            url: browser.runtime.getURL(`popup.html#${path}?mode=web`),
        });
    };

    return {
        goPlugin,
        goWebsite,
    };
}
