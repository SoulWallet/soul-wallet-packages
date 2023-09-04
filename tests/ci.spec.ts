import { test } from "./utils/fixtures";
import fs from "fs";
import path from "path";
import { activate } from "./activateWallet";
import { recovery } from "./recoveryWallet";
import { execSync } from "child_process";

const archiveDir = path.join(__dirname, "archive");

const screenshotDir = path.join(archiveDir, "screenshot");
if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
}

const videoDir = path.join(archiveDir, "screenrecord");
if (!fs.existsSync(videoDir)) {
    fs.mkdirSync(videoDir, { recursive: true });
}
const networkDir = path.join(archiveDir, "network");
if (!fs.existsSync(networkDir)) {
    fs.mkdirSync(networkDir, { recursive: true });
}
const SHARING_FILE = path.join(archiveDir, "sharing.json");
if (fs.existsSync(SHARING_FILE)) {
    fs.unlinkSync(SHARING_FILE);
}

const metamaskChromeDir = path.join(archiveDir, "chrome");
if (!fs.existsSync(metamaskChromeDir)) {
    // curl -o metamask.zip https://raw.githubusercontent.com/jayden-sudo/archive/main/metamask.zip && unzip metamask.zip -d ./metamask
    console.log("download metamask");
    execSync(
        `curl -o ${path.join(
            archiveDir,
            "metamask.zip",
        )} https://raw.githubusercontent.com/jayden-sudo/archive/main/metamask.zip && unzip ${path.join(
            archiveDir,
            "metamask.zip",
        )} -d ${archiveDir}`,
    );
    console.log("download metamask done");
}

test.describe("CI", () => {
    test("Activate Wallet", async ({ context, extensionId }) => {
        test.setTimeout(1000 * 60 * 3);
        console.log("extensionId", extensionId);
        try {
            const { walletAddress, guardians, threshold } = await activate(context, extensionId, screenshotDir, {
                skipActivate: false,
            });
            fs.writeFileSync(SHARING_FILE, JSON.stringify({ walletAddress, guardians, threshold }));
        } catch (e) {
            fs.writeFileSync(SHARING_FILE, "");
            throw e;
        }
    });
    test("Recovery Wallet", async ({ context, extensionId }) => {
        test.setTimeout(1000 * 60 * (3 + 5));
        await new Promise((resolve) => setTimeout(resolve, 1000 * 10));
        while (!fs.existsSync(SHARING_FILE)) {
            //console.log("wait for activate wallet");
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        const fileContent = fs.readFileSync(SHARING_FILE, "utf-8");
        if (fileContent === "") {
            throw new Error("activate wallet failed");
        }
        const json = JSON.parse(fileContent);
        const walletAddress: string[] = json.walletAddress;
        const guardians: string[] = json.guardians;
        const threshold: number = json.threshold;

        await recovery(context, extensionId, screenshotDir, walletAddress[0], guardians, threshold);
    });
});
