import { BrowserContext } from "@playwright/test";
import { MetaMask } from "./utils/metamask";
import Jimp from "jimp";
import fs from "fs";
import path from "path";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const qrCodeReader = require("qrcode-reader");

export async function recovery(
    context: BrowserContext,
    extensionId: string,
    screenshotDir: string,
    walletAddress: string,
    guardians: string[],
    threshold: number,
) {
    // list all pages
    let pages = await context.pages();
    if (pages.length < 2) {
        await context.waitForEvent("page");
        pages = await context.pages();
    }
    // find popup page
    const popupPage = pages.find((page) => {
        return page.url().startsWith(`chrome-extension://${extensionId}/popup.html`);
    });
    if (popupPage === undefined) {
        debugger;
        throw new Error("popupPage is undefined");
    }

    await MetaMask.init(context);
    await MetaMask.importPrivateKey(context, guardians[0]);

    await popupPage.getByRole("button", { name: "I Understand" }).click();
    await popupPage.getByText("Wallet recovery").click();
    while (true) {
        await popupPage.getByPlaceholder("Enter wallet address").click();
        await popupPage.getByPlaceholder("Enter wallet address").fill(walletAddress);
        await popupPage.getByRole("button", { name: "Next" }).click();
        try {
            await popupPage.getByPlaceholder("Set Password").click({
                timeout: 1000 * 5,
            });
            break;
        } catch (e) {
            // loaded
            await popupPage.reload({
                waitUntil: "networkidle",
            });
            continue;
        }
    }
    await popupPage.getByPlaceholder("Set Password").fill("111111111");
    await popupPage.getByPlaceholder("Confirm password").click();
    await popupPage.getByPlaceholder("Confirm password").fill("111111111");
    await popupPage.getByRole("button", { name: "Continue" }).click();
    await popupPage.getByRole("button", { name: "Next" }).click();
    const qrPath = path.join(screenshotDir, `QR-recovery-${new Date().getTime()}.png`);
    await popupPage.screenshot({ path: qrPath });
    const buffer = fs.readFileSync(qrPath);
    const imageData = await Jimp.read(buffer);
    const qrCodeInstance = new qrCodeReader();
    let recoveryUrl = "";
    qrCodeInstance.callback = function (err: Error, value: { result: string }) {
        if (err) {
            console.error(err);
            recoveryUrl = "error";
        } else {
            recoveryUrl = value.result;
        }
    };
    qrCodeInstance.decode(imageData.crop(500, 250, 300, 300).bitmap);
    while (recoveryUrl === "") {
        await popupPage.waitForTimeout(100);
    }
    if (recoveryUrl === "error") {
        throw new Error("qrResult is error");
    }
    const signPage = await context.newPage();
    await signPage.goto(recoveryUrl, { waitUntil: "networkidle" });
    await signPage.getByRole("button", { name: "Connect wallet" }).click();
    await signPage.getByRole("button", { name: "Sign" }).click();
    // wait 'Guardian signature received!'
    await signPage.waitForSelector("text=Guardian signed!");
    await signPage.close();

    popupPage.getByRole("button", { name: "Pay fee" }).click();
    // wait new page
    const payFeePage = await context.waitForEvent("page");
    await payFeePage.getByRole("button", { name: "Connect wallet and pay" }).click();
    let networkName = "";
    let networkFee = 0;
    for (let index = 0; index < 10; index++) {
        // '0xc6...9f98\n\nPay recovery fee\n\nAnyone can pay the recovery fee, but it must be paid in ETH.\n\nNetwork:\nGoerli\nNetwork fee:\n0.000151834803644035 ETH\nPay\nShare with others\n\nYour Ethereum wallet is set for immediate recovery. All Layer2 wallets are estimated to be recovered in 12:56:73.\n\nSoul Wallet - Smart contract wallet for Ethereum'
        const text = await payFeePage.innerText("body");
        networkName = "";
        networkFee = 0;
        const textArr = text.split("\n");
        for (let i = 0; i < textArr.length; i++) {
            if (textArr[i] === "Network:") {
                networkName = textArr[i + 1];
            } else if (textArr[i] === "Network fee:") {
                networkFee = parseFloat(textArr[i + 1].split(" ")[0]);
            }
            if (networkFee > 0 && networkName !== "") {
                break;
            }
        }
        if (networkName !== "-") {
            break;
        }
        await payFeePage.waitForTimeout(1000);
    }

    if (networkName !== "Goerli") {
        throw new Error(`networkName(${networkName}) !== Goerli`);
    }
    const maxFee = 0.001;
    if (networkFee > maxFee) {
        throw new Error(`networkFee(${networkFee}) > maxFee(${maxFee})`);
    }

    await payFeePage.waitForTimeout(1000);
    await payFeePage.getByRole("button", { name: "Pay" }).click({
        delay: 500,
    });
    await payFeePage.waitForSelector("text=Transaction Success");
    await payFeePage.close();
    let recoveryStatus = false;
    for (let index = 0; index < 60; index++) {
        await popupPage.waitForTimeout(1000 * 5);
        // Recovery in progress

        await popupPage.reload({
            waitUntil: "networkidle",
        });

        const text = await popupPage.innerText("body");
        // 'Recovery in progress\n\nYour Keystore\nRecovered\n\nL2 recover status\n\nGoerli\nPending (9/2/2023, 8:51:38 PM)\nOptimism Goerli\nPending (9/2/2023, 8:51:38 PM)\nArbitrum Goerli\nPending (9/2/2023, 8:51:38 PM)'
        if (text.includes("Goerli\nRecovered")) {
            recoveryStatus = true;
            break;
        }
    }
    if (!recoveryStatus) {
        throw new Error("recoveryStatus is false");
    }

    // activate a new wallet
    // #TODO

    //await popupPage.waitForTimeout(1000 * 60 * 10);
    await popupPage.close();
}
