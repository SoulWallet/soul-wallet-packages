import { test, expect } from "./fixtures";
import { ethers } from "ethers";
import { Config } from "./config";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qrCodeReader = require("qrcode-reader");
import Jimp from "jimp";
import fs from "fs";
import path from "path";
import { Page } from "@playwright/test";

const screenshotDir = path.join(__dirname, "screenshot");
console.log("screenshotDir", screenshotDir);
if (fs.existsSync(screenshotDir)) {
    fs.rmSync(screenshotDir, { recursive: true });
}
fs.mkdirSync(screenshotDir);

let screenshotIndex = 0;

function screenshot(page: Page, name: string) {
    screenshotIndex++;
    const imgPath = path.join(screenshotDir, `${screenshotIndex}-${name}.png`);
    setTimeout(async () => {
        await page.screenshot({ path: imgPath });
    }, 100);
    return imgPath;
}

test("Activate", async ({ context, extensionId }) => {
    test.setTimeout(1000 * 60 * 2);

    console.log("extensionId", extensionId);

    // list all pages
    let pages = await context.pages();
    debugger;
    if (pages.length < 2) {
        await context.waitForEvent("page");
        pages = await context.pages();
    }
    // find popup page
    const popupPage = pages.find((page) => {
        return page.url().startsWith(`chrome-extension://${extensionId}/popup.html`);
    });
    if (popupPage === undefined) {
        throw new Error("popupPage is undefined");
    }

    screenshot(popupPage, "Terms");

    await popupPage.getByRole("button", { name: "I Understand" }).click();
    await popupPage.getByText("Create New Wallet").click();

    screenshot(popupPage, "Create New Wallet - Set Password");

    const password = "password%" + new Date().getTime();
    await popupPage.getByPlaceholder("Set Password").click();
    await popupPage.getByPlaceholder("Set Password").fill(password);
    await popupPage.getByPlaceholder("Confirm password").click();
    await popupPage.getByPlaceholder("Confirm password").fill(password);
    await popupPage.getByRole("button", { name: "Continue" }).click();

    screenshot(popupPage, "Create New Wallet - Set Guardians");

    const guardians: string[] = [
        ethers.Wallet.createRandom().privateKey,
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

    screenshot(popupPage, "Create New Wallet - Store Guardians");

    await popupPage.getByRole("button", { name: "Store On-chain" }).click();
    await popupPage.getByRole("button", { name: "Continue" }).click();
    await popupPage.getByRole("button", { name: "Yes" }).click();
    // await popupPage.getByRole('button', { name: 'Activate Wallet' }).click();

    await popupPage.goto(`chrome-extension://${extensionId}/popup.html`);

    screenshot(popupPage, "Home Page");

    // wait text: Activate wallet now!
    await popupPage.waitForSelector("text=Activate wallet now!");
    await popupPage.getByRole("button", { name: "Begin" }).click();

    screenshot(popupPage, "Activate Wallet");

    let networkFeeEther = 0;
    {
        // wait <p>Network fee</p>
        const networkFeeKeyWord = "Network fee";
        const networkFee = await popupPage.waitForSelector(`text=${networkFeeKeyWord}`, { state: "visible" });
        // get networkFee parent
        const networkFeeParent = await networkFee.$("xpath=..");
        expect(networkFeeParent).not.toBeNull();
        let networkFeeTxt = "";
        let _loadingIndex = 0;
        for (let index = 0; index < 10; index++) {
            // get networkFee parent's text
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const networkFeeParentText = await networkFeeParent!.innerText();
            if (networkFeeParentText.includes("Loading")) {
                _loadingIndex = index;
            } else {
                networkFeeTxt = networkFeeParentText.substring(_loadingIndex + "Loading".length).trim();
                break;
            }
            await popupPage.waitForTimeout(1000);
        }

        /* 
        networkFeeTxt: 
        0.000098
        
        ETH
        */
        expect(networkFeeTxt).not.toEqual("");
        networkFeeEther = parseFloat(networkFeeTxt.split("\n")[0].trim());
    }

    // get network
    let netWorkName = "";
    {
        const _network = await popupPage.waitForSelector("text=Network", { state: "visible" });
        const _networkParent = await _network.$("xpath=..");
        expect(_networkParent).not.toBeNull();
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const _networkParentText = await _networkParent!.innerText();
        /* 
    _networkParentText:
    Network
    
    Arbitrum Goerli
        */
        netWorkName = _networkParentText.substring("Network".length).trim();
    }

    const providerEndpoint = Config.Rpc(netWorkName);
    const ethersProvider = new ethers.JsonRpcProvider(providerEndpoint);
    const coinBaseWallet = new ethers.Wallet(Config.privateKey(), ethersProvider);

    // get wallet address
    const qrAddress = screenshot(popupPage, "Activate Wallet - QR Code");
    await popupPage.waitForTimeout(1000);
    const buffer = fs.readFileSync(qrAddress);
    const imageData = await Jimp.read(buffer);
    const qrCodeInstance = new qrCodeReader();
    let qrResult = "";
    qrCodeInstance.callback = function (err: Error, value: { result: string }) {
        if (err) {
            console.error(err);
            qrResult = "error";
        } else {
            qrResult = value.result;
        }
    };
    qrCodeInstance.decode(imageData.crop(120, 280, 150, 150).bitmap);
    while (qrResult === "") {
        await popupPage.waitForTimeout(100);
    }
    if (qrResult === "error") {
        throw new Error("qrResult is error");
    }
    const walletAddress = ethers.getAddress(qrResult);
    console.log("walletAddress", walletAddress);

    // send ${gasFee} ETH to walletAddress from coinBaseWallet
    {
        const tx = await coinBaseWallet.sendTransaction({
            to: walletAddress,
            value: ethers.parseEther(networkFeeEther.toString()),
        });
        await tx.wait();
        // get balance of walletAddress
        const balance = await ethersProvider.getBalance(walletAddress);
        console.log("balance", balance.toString());
        if (balance !== BigInt(ethers.parseEther(networkFeeEther.toString()))) {
            throw new Error("balance !== gasFee");
        }
    }
    await popupPage.getByRole("button", { name: "Activate" }).click();

    screenshot(popupPage, "Activate Wallet - Activate");

    // wait walletAddress code != '0x' ,max 60s
    let walletCode = "0x";
    for (let i = 0; i < 60; i++) {
        walletCode = await ethersProvider.getCode(walletAddress);
        if (walletCode !== "0x") {
            console.log("wallet activated");
            break;
        }
        await popupPage.waitForTimeout(1000);
    }
    if (walletCode === "0x") {
        throw new Error("walletCode === 0x");
    }

    screenshot(popupPage, "Activate Wallet - Activated");

    // wait div hasText 'Send tokens' (Home page)
    await popupPage
        .locator("div")
        .filter({ hasText: /^Send tokens$/ })
        .click();
    await popupPage.getByRole("button", { name: "MAX" }).click();
    await popupPage.waitForTimeout(1000);
    await popupPage.getByRole("button", { name: "MAX" }).click();
    await popupPage.locator("div").filter({ hasText: /^To$/ }).getByRole("textbox").click();
    await popupPage
        .locator("div")
        .filter({ hasText: /^To$/ })
        .getByRole("textbox")
        .fill("0xb9d3eF27DDBAD4D361A412dc419EBB3A7Ee586c5");
    await popupPage.getByRole("button", { name: "Review" }).click();
    await popupPage.getByRole("button", { name: "Sign" }).click();
    await popupPage.waitForTimeout(1000 * 10);
    // wait div hasText 'Send tokens' (Home page)
    await popupPage.locator("div").filter({ hasText: /^Send tokens$/ });

    screenshot(popupPage, "Send tokens");

    await popupPage.waitForTimeout(1000);
});
