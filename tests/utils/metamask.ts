import { BrowserContext } from "@playwright/test";

export class MetaMask {
    static async init(context: BrowserContext) {
        const metamask = await context.newPage();
        await metamask.goto(`chrome-extension://${process.env.METAMASK_EXTENSIONID}/home.html#onboarding/welcome`);
        await metamask.waitForSelector("[data-testid=onboarding-create-wallet]");
        await metamask.getByText("I agree to MetaMask's Terms of use").click();
        await metamask.getByTestId("onboarding-create-wallet").click();
        await metamask.getByTestId("metametrics-no-thanks").click();
        await metamask.getByTestId("create-password-new").click();
        await metamask.getByTestId("create-password-new").fill("11111111");
        await metamask.getByTestId("create-password-confirm").click();
        await metamask.getByTestId("create-password-confirm").fill("11111111");
        await metamask
            .locator("label")
            .filter({ hasText: "I understand that MetaMask cannot recover this password for me. Learn more" })
            .click();
        await metamask.getByTestId("create-password-wallet").click();
        await metamask.getByTestId("secure-wallet-later").click();
        await metamask.locator("label").click();
        await metamask.getByTestId("skip-srp-backup").click();
        await metamask.getByTestId("onboarding-complete-done").click();
        await metamask.getByTestId("pin-extension-next").click();
        await metamask.getByTestId("pin-extension-done").click();
        await metamask.getByTestId("popover-close").click();
        await metamask.close();
    }
    static async importPrivateKey(context: BrowserContext, privateKey: string) {
        const metamask = await context.newPage();
        await metamask.goto(`chrome-extension://${process.env.METAMASK_EXTENSIONID}/home.html`);
        await metamask.getByTestId("account-menu-icon").click();
        await metamask.getByRole("button", { name: "Import account" }).click();
        await metamask.getByLabel("Enter your private key string here:").fill(privateKey);
        await metamask.getByTestId("import-account-confirm-button").click();
        await metamask.close();
    }
}
