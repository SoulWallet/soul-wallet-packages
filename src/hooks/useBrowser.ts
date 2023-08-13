import browser from "webextension-polyfill";
import { openWindow } from "@src/lib/tools";
import { useNavigate } from "react-router-dom";

export default function useBrowser() {
    const nav = useNavigate();

    /**
     * add version prefix and do some check
     * @param route 
     */
    const navigate = async (route: string) => {
        // check version
        nav(`/v1/${route}`);
    }

    const navigateToSign = async ({
        txns,
        sendTo,
    }: any)=> {
        navigate(`sign?action=approveTransaction&txns=${JSON.stringify(txns)}&sendTo=${sendTo}`)
    }

    const goWebsite = async (path = "/") => {
        browser.tabs.create({
            url: getFullscreenUrl(path),
        });
    };

    const goPlugin = async (route: string) => {
        const version = 'v1'
        const tabs = await browser.tabs.query({
            active: true,
            currentWindow: true,
        });
        const windowWidth = tabs[0].width;
        openWindow(`chrome-extension://${browser.runtime.id}/popup.html#${version}/${route}`, windowWidth || window.screen.width);
    };

    const getFullscreenUrl = (path: string) => {
        return browser.runtime.getURL(`popup.html#/v1/${path}?mode=web`);
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
        navigate,
        navigateToSign,
        goPlugin,
        goWebsite,
        closeCurrentTab,
        replaceCurrentTab,
    };
}
