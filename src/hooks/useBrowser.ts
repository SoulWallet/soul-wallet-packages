import browser from "webextension-polyfill";

export default function useBrowser() {
    const goPlugin = async (route: string) => {
        console.log('route is', route)
        console.log(`route, chrome-extension://${browser.runtime.id}/popup.html#${route}`)
        browser.windows.create({
            type: "popup",
            url: `chrome-extension://${browser.runtime.id}/popup.html#${route}`,
            width: 360,
            height: 600 + 28, // 28 is title bar
            top: 0,
            left: window.screen.width - 360,
        });
    };

    const getFullscreenUrl = (path: string) => {
        return browser.runtime.getURL(`popup.html#${path}?mode=web`);
    };

    const goWebsite = async (path = "/") => {
        browser.tabs.create({
            url: getFullscreenUrl(path),
        });
    };

    const closeCurrentTab = async () => {
        browser.tabs.getCurrent().then((tab) => {
            tab.id && browser.tabs.remove(tab.id);
        });
    };

    const replaceCurrentTab = async (path: string) => {
        browser.tabs.getCurrent().then((tab) => {
            tab.id && browser.tabs.update(tab.id, { url: getFullscreenUrl(path) });
        });
    };

    return {
        goPlugin,
        goWebsite,
        closeCurrentTab,
        replaceCurrentTab,
    };
}
