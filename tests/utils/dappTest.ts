import { test, expect, chromium, type BrowserContext } from "@playwright/test";
import { platform, homedir } from "os";
import path from "path";
import fs from "fs";
import { execSync, spawn } from "child_process";
import { ABI_SoulWallet, ABI_EntryPoint } from "@soulwallet/abi";
import { IDapp } from "../interfaces/IDapp";

// ts-node ./tests/dappTest.ts

async function getJson(url: string) {
    const response = await fetch(url);
    const json = await response.json();
    return json;
}

async function main() {
    const _platform = platform();
    // 'aix','android','darwin','freebsd','linux','openbsd','sunos','win32','cygwin','netbsd'
    let browserPath = "";
    if (_platform === "win32") {
        const chromeRegQuery = `reg query "HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\App Paths\\chrome.exe" /ve`;
        const stdout = execSync(chromeRegQuery);
        const stdoutStr = stdout.toString();
        console.log("stdoutStr", stdoutStr);
        throw new Error("Not implemented");
    } else if (_platform === "darwin") {
        browserPath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
    } else if (_platform === "linux") {
        throw new Error("Not implemented");
    } else {
        console.log("Unknown operating system");
    }
    if (false) {
        const args = ["--remote-debugging-port=9222", "--disable-web-security"];
        const childProcess = spawn(browserPath, args);
        childProcess.on("error", (error) => {
            console.error("Error:", error);
        });
        childProcess.on("close", (code) => {
            console.log(`Child process exited with code ${code}`);
        });
        let webSocketDebuggerUrl = "";
        for (let i = 0; i < 20; i++) {
            try {
                const json = await getJson("http://localhost:9222/json/version");
                webSocketDebuggerUrl = json.webSocketDebuggerUrl;
                break;
            } catch (error) { }
            await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        if (webSocketDebuggerUrl === "") {
            throw new Error("Chrome not start");
        }
    }

    const browser = await chromium.connectOverCDP("http://localhost:9222");
    const defaultContext = browser.contexts()[0];

    defaultContext.on("page", async (page) => {
        const url = page.url();
        if (url.startsWith("chrome-extension://")) {
            while (page.isClosed() === false) {
                // auto unlock wallet
                const input_password = await page.getByPlaceholder("Password");
                if (input_password) {
                    if ((await input_password.isVisible()) && (await input_password.isEnabled())) {
                        await input_password.click();
                        await input_password.fill("123456789");
                        await page.getByRole("button", { name: "Continue" }).click();
                    }
                }

                // auto connect
                const btn_connect = await page.getByRole("button", { name: "Connect" });
                if (btn_connect) {
                    if ((await btn_connect.isVisible()) && (await btn_connect.isEnabled())) {
                        await btn_connect.click();
                    }
                }

                // auto sign
                const btn_sign = await page.getByRole("button", { name: "Sign" });
                if (btn_sign) {
                    if ((await btn_sign.isVisible()) && (await btn_sign.isEnabled())) {
                        await btn_sign.click();
                    }
                }

                await page.waitForTimeout(500);
            }
        }
    });
    {
        const dappsFolder = path.resolve(__dirname, "dapps");
        const files = await fs.readdirSync(dappsFolder);
        const tsFiles = files.filter((file: string) => file.endsWith(".ts"));
        const logs = [];
        for (const tsFile of tsFiles) {
            const className = tsFile.replace(".ts", "");
            const modulePath = path.resolve(__dirname, "dapps", tsFile);
            const module = await import(modulePath);
            const dapp: IDapp = new module[className]();
            const page = await defaultContext.newPage();
            const log = {
                name: dapp.name,
                website: dapp.website,
                success: false,
                error: "",
            };
            try {
                log.success = await dapp.run(page);
            } catch (error: unknown) {
                if (error instanceof Error) {
                    log.error = error.message;
                } else {
                    throw error;
                }
            } finally {
                await page.close();
            }
            logs.push(log);
        }

        console.table(logs);
    }
}
main();
