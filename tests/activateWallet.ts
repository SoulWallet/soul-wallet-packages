import { ethers } from "ethers";
import { UIKit } from "./utils/uikit";
import { BrowserContext } from "@playwright/test";
import { Config } from "./utils/config";

export async function activate(
    context: BrowserContext,
    extensionId: string,
    screenshotDir: string,
    options?: {
        skipActivate: boolean;
    },
) {
    // list all pages
    let pages = await context.pages();
    if (pages.length < 2) {
        await context.waitForEvent("page");
        pages = await context.pages();
    }
    // 'chrome-extension://kmddadnangndkmcdkmappjfkdmamkmen/popup.html#/v1/launch?mode=web'
    // find popup page
    const popupPage = pages.find((page) => {
        return page.url().startsWith(`chrome-extension://${extensionId}/popup.html`);
    });
    if (popupPage === undefined) {
        debugger;
        throw new Error("popupPage is undefined");
    }
    for (let index = 0; index < pages.length; index++) {
        const page = pages[index];
        if (page.url() === "about:blank") {
            await page.close();
            break;
        }
    }

    await popupPage.getByRole("button", { name: "I Understand" }).click();
    await popupPage.getByText("Create New Wallet").click();

    const password = "password%" + new Date().getTime();
    await popupPage.getByPlaceholder("Set Password").click();
    await popupPage.getByPlaceholder("Set Password").fill(password);
    await popupPage.getByPlaceholder("Confirm password").click();
    await popupPage.getByPlaceholder("Confirm password").fill(password);
    await popupPage.getByRole("button", { name: "Continue" }).click();

    const guardians: string[] = [
        Config.privateKey(),
        ethers.Wallet.createRandom().privateKey,
        ethers.Wallet.createRandom().privateKey,
    ];
    const guardianAccounts = [
        new ethers.Wallet(guardians[0]),
        new ethers.Wallet(guardians[1]),
        new ethers.Wallet(guardians[2]),
    ];
    const threshold = 1;

    await popupPage.getByPlaceholder("Enter guardian address").first().click();
    await popupPage.getByPlaceholder("Enter guardian address").first().fill(guardianAccounts[0].address);
    await popupPage.getByPlaceholder("Enter guardian address").nth(1).click();
    await popupPage.getByPlaceholder("Enter guardian address").nth(1).fill(guardianAccounts[1].address);
    await popupPage.getByPlaceholder("Enter guardian address").nth(2).click();
    await popupPage.getByPlaceholder("Enter guardian address").nth(2).fill(guardianAccounts[2].address);
    await popupPage.getByPlaceholder("Enter amount").click();
    await popupPage.getByPlaceholder("Enter amount").fill(threshold.toString());
    await popupPage.getByRole("button", { name: "Continue" }).click();

    await popupPage.getByRole("button", { name: "Store On-chain" }).click();
    await popupPage.getByRole("button", { name: "Continue" }).click();
    await popupPage.getByRole("button", { name: "Yes" }).click();
    // await popupPage.getByRole('button', { name: 'Activate Wallet' }).click();
    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    const chainNames = await UIKit.listChainNames(popupPage);
    console.log("chainNames", chainNames);
    const supportedChainNames = ["Arbitrum Goerli", "Goerli"];
    if (
        chainNames.length !== supportedChainNames.length ||
        chainNames[0] !== supportedChainNames[0] ||
        chainNames[1] !== supportedChainNames[1]
    ) {
        throw new Error(`chainNames not match!`);
    }
    let walletAddress = "";
    {
        // Arbitrum Goerli
        const chainName = supportedChainNames[0];
        await UIKit.chooseChain(popupPage, chainName);
        walletAddress = await UIKit.activateWallet(popupPage, chainName, screenshotDir, options);
        //await UIKit.sendToken(popupPage, "0xb9d3eF27DDBAD4D361A412dc419EBB3A7Ee586c5", "MAX");
    }
    // {
    //     // Goerli
    //     const chainName = supportedChainNames[1];
    //     await UIKit.chooseChain(popupPage, chainName);
    //     await UIKit.activateWallet(popupPage, chainName, screenshotDir);
    // }

    return {
        walletAddress: [walletAddress],
        guardians: guardians,
        threshold: threshold,
    };
}
