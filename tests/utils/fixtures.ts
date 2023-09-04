import { test as base, expect, chromium, type BrowserContext } from "@playwright/test";
import path from "path";
import fs from "fs";
const archiveDir = path.join(__dirname, "..", "archive");
const pathToExtension = path.join(__dirname, "..", "..", "dist");
const metamaskDir = path.join(archiveDir, "chrome");
const videoDir = path.join(archiveDir, "screenrecord");
const networkDir = path.join(archiveDir, "network");

function skipURL(url: string) {
    return (
        url.includes(".codefi.network") ||
        url.includes(".github.") ||
        url.includes("infura.io") ||
        url.startsWith("chrome-extension://") ||
        url.endsWith(".ttf") ||
        url.endsWith(".js") ||
        url.endsWith(".png") ||
        url.endsWith(".jpg") ||
        url.endsWith(".gif") ||
        url.endsWith(".zip")
    );
}

export const test = base.extend<{
    context: BrowserContext;
    extensionId: string;
}>({
    context: async ({}, use) => {
        if (!fs.existsSync(metamaskDir)) {
            throw new Error("metamaskDir not exist");
        }
        const networkJson = path.join(networkDir, new Date().getTime().toString() + Math.random().toString() + ".json");
        const context = await chromium.launchPersistentContext("", {
            recordVideo: {
                dir: videoDir,
            },
            headless: false,
            args: [
                `--disable-extensions-except=${pathToExtension},${metamaskDir}`,
                `--load-extension=${pathToExtension},${metamaskDir}`,
            ],
        });
        context.on("request", (request) => {
            if (skipURL(request.url().toLowerCase())) {
                return;
            }
            const data =
                JSON.stringify({
                    time: new Date().toLocaleTimeString(),
                    type: "request",
                    url: request.url(),
                    method: request.method(),
                    headers: request.headers(),
                    postData: request.postData(),
                }) + "\n";
            fs.writeFileSync(networkJson, data, {
                flag: "a",
            });
        });

        context.on("response", async (response) => {
            if (skipURL(response.url().toLowerCase())) {
                return;
            }
            let body = "<NULL>";
            try {
                body = await response.text();
            } catch (error) {
                console.error(error);
            }
            const data =
                JSON.stringify({
                    time: new Date().toLocaleTimeString(),
                    type: "response",
                    url: response.url(),
                    status: response.status(),
                    headers: response.headers(),
                    body: body,
                }) + "\n";
            fs.writeFileSync(networkJson, data, {
                flag: "a",
            });
        });
        await use(context);
        await context.close();
    },
    extensionId: async ({ context }, use) => {
        // for manifest v2:
        let pages = context.backgroundPages();
        while (pages.length !== 2) {
            await context.waitForEvent("backgroundpage");
            pages = context.backgroundPages();
        }
        let extensionId = "";
        if (pages[0].url().endsWith("/background.html")) {
            process.env.METAMASK_EXTENSIONID = pages[0].url().split("/")[2];
            extensionId = pages[1].url().split("/")[2];
        } else {
            process.env.METAMASK_EXTENSIONID = pages[1].url().split("/")[2];
            extensionId = pages[0].url().split("/")[2];
        }
        //for manifest v3:
        // let [background] = context.serviceWorkers();
        // if (!background) background = await context.waitForEvent("serviceworker");

        await use(extensionId);
    },
});

export { expect };
