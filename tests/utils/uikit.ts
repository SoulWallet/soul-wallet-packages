import { Page } from "@playwright/test";
import { ethers } from "ethers";
import { Config } from "./config";
import Jimp from "jimp";
import fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qrCodeReader = require("qrcode-reader");

export class UIKit {
    static async listChainNames(page: Page) {
        await page.waitForSelector("[data-testid=btn-chain-select]");
        await page.getByTestId("btn-chain-select").click();
        await page.waitForTimeout(200);
        // get all testid start with 'chain-'
        const chainList = await page.locator("[data-testid^=text-chainname-]");
        const allChainList = await chainList.all();
        const chainNameList: string[] = [];
        for (let index = 0; index < allChainList.length; index++) {
            const element = allChainList[index];
            const text = await element.innerText();
            chainNameList.push(text);
        }
        await page.getByTestId("btn-chain-select").click();
        await page.waitForTimeout(200);
        return chainNameList;
    }

    static async chooseChain(page: Page, chainName: string) {
        await page.getByTestId("btn-chain-select").click();
        await page.waitForTimeout(200);
        const btnChains = await page.locator(`[data-testid^=text-chainname-]`);
        const btnChainList = await btnChains.all();
        let btnChainIndex = -1;
        for (let index = 0; index < btnChainList.length; index++) {
            const element = btnChainList[index];
            const text = await element.innerText();
            if (text === chainName) {
                btnChainIndex = index;
                break;
            }
        }
        if (btnChainIndex === -1) {
            throw new Error(`not found chainName: ${chainName}`);
        }
        const btnChain = btnChainList[btnChainIndex];
        await btnChain.click();
        await page.waitForTimeout(200);
    }

    static async activateWallet(
        page: Page,
        netWorkName: string,
        screenshotDir: string,
        options?: {
            skipActivate: boolean;
        },
    ) {
        const providerEndpoint = Config.Rpc(netWorkName);
        const ethersProvider = new ethers.JsonRpcProvider(providerEndpoint);
        const coinBaseWallet = new ethers.Wallet(Config.privateKey(), ethersProvider);
        await page.waitForSelector("text=Activate wallet now!");
        await page.getByRole("button", { name: "Begin" }).click();

        const networkFee = await page.waitForSelector("[data-testid=network-fee]");
        const networkFeeEther = parseFloat(await networkFee.innerText());
        console.log("networkFeeEther", networkFeeEther);
        // networkFeeEther must <= env.maxfee-chainname
        if (networkFeeEther > Config.maxFee(netWorkName)) {
            throw new Error(`networkFeeEther(${networkFeeEther}) > Config.maxFee(${Config.maxFee(netWorkName)})`);
        }

        // get wallet address

        const qrPath = path.join(screenshotDir, `QR-walletAddress-${new Date().getTime()}.png`);
        await page.screenshot({ path: qrPath });
        const buffer = fs.readFileSync(qrPath);
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
            await page.waitForTimeout(100);
        }
        if (qrResult === "error") {
            throw new Error("qrResult is error");
        }
        const walletAddress = ethers.getAddress(qrResult);
        console.log("walletAddress", walletAddress);
        if (options?.skipActivate) {
            return walletAddress;
        }

        // send ${gasFee} ETH to walletAddress from coinBaseWallet
        {
            const tx = await coinBaseWallet.sendTransaction({
                to: walletAddress,
                value: ethers.parseEther(networkFeeEther.toString()).toString(),
            });
            await tx.wait();
            // get balance of walletAddress
            const balance = await ethersProvider.getBalance(walletAddress);
            console.log("balance", balance.toString());
            if (balance !== ethers.parseEther(networkFeeEther.toString())) {
                throw new Error("balance !== gasFee");
            }
        }
        await page.getByRole("button", { name: "Activate" }).click();

        // wait walletAddress code != '0x' ,max 60s
        let walletCode = "0x";
        for (let i = 0; i < 60; i++) {
            walletCode = await ethersProvider.getCode(walletAddress);
            if (walletCode !== "0x") {
                console.log("wallet activated");
                break;
            }
            await page.waitForTimeout(1000);
        }
        if (walletCode === "0x") {
            throw new Error("walletCode === 0x");
        }
        // wait div hasText 'Send tokens' (Home page)
        await page.locator("div").filter({ hasText: /^Send tokens$/ });
        return walletAddress;
    }

    static async sendToken(page: Page, to: string, amount: number | "MAX" = "MAX") {
        // wait div hasText 'Send tokens' (Home page)
        await page
            .locator("div")
            .filter({ hasText: /^Send tokens$/ })
            .click();
        if (amount === "MAX") {
            await page.getByRole("button", { name: "MAX" }).click();
            await page.waitForTimeout(1000);
            await page.getByRole("button", { name: "MAX" }).click();
        } else {
            throw new Error("not support amount");
        }
        await page.locator("div").filter({ hasText: /^To$/ }).getByRole("textbox").click();
        await page.locator("div").filter({ hasText: /^To$/ }).getByRole("textbox").fill(to);
        await page.getByRole("button", { name: "Review" }).click();
        await page.getByRole("button", { name: "Sign" }).click();
        await page.waitForTimeout(1000 * 10);
        // wait div hasText 'Send tokens' (Home page)
        await page.locator("div").filter({ hasText: /^Send tokens$/ });
    }
}
