import { test as base, chromium, type BrowserContext } from "@playwright/test";
import process from "process";

// '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome' --remote-debugging-port=9222 --disable-web-security
// CODEGEN='true' pnpm exec playwright test codegen.spec.ts --debug

export const test = base.extend<{
    context: BrowserContext;
}>({
    context: async ({}, use) => {
        if (process.env.CODEGEN === "true") {
            const browser = await chromium.connectOverCDP("http://localhost:9222");
            const context = browser.contexts()[0];
            await use(context);
            await context.close();
        } else {
            const browser = await chromium.launch({
                headless: true,
            });
            const context = await browser.newContext();
            await use(context);
            await context.close();
        }
    },
});

test.describe("dev only", () => {
    if (process.env.CODEGEN !== "true") {
        test.skip(true);
    }
    test("codegen helper", async ({ context }) => {
        const page = await context.newPage();
        await page.waitForTimeout(1000 ** 10);
    });
});
