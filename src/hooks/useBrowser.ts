import browser from "webextension-polyfill";
import { openWindow } from "@src/lib/tools";

export default function useBrowser() {
    const goPlugin = async (route: string) => {
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        const windowWidth = tabs[0].width;
        openWindow(`chrome-extension://${browser.runtime.id}/popup.html#${route}`, windowWidth || window.screen.width);
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
