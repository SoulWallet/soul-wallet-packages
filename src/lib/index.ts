import browser, { Tabs } from "webextension-polyfill";

export function executeScript(fn: () => void, args: any): void {
    browser.tabs
        .query({ active: true, currentWindow: true })
        .then((tabs: Tabs.Tab[]) => {
            // Pulls current tab from browser.tabs.query response
            const currentTab: Tabs.Tab | number = tabs[0];

            // Short circuits function execution is current tab isn't found
            if (!currentTab) {
                return;
            }
            const currentTabId: number = currentTab.id as number;

            // Executes the script in the current tab
            browser.scripting
                .executeScript({
                    target: {
                        tabId: currentTabId,
                    },
                    func: fn,
                    args: [args],
                })
                .then(() => {
                    console.log("Done");
                });
        });
}
