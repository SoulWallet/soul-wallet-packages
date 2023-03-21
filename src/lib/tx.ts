import { SoulWalletLib, IUserOpReceipt, IFailedOp, IValidationResult } from "soul-wallet-lib";
import { ethers } from "ethers";
import browser from "webextension-polyfill";
import config from "@src/config";
import { notify } from "@src/lib/tools";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

const soulWalletLib = new SoulWalletLib();

export const executeTransaction = async (operation: any, tabId: any, bundlerUrl: any) => {
    const bundler = new soulWalletLib.Bundler(config.contracts.entryPoint, ethersProvider, bundlerUrl);

    await bundler.init();

    return new Promise(async (resolve, reject) => {
        try {
            const validation = await bundler.simulateValidation(operation);

            console.log("validation result", validation);

            if (validation.status !== 0) {
                const result = validation.result as IFailedOp;
                if (validation.status === 1) {
                    notify("Bundler Error", result.reason);
                    throw new Error(result.reason);
                } else {
                    const errMsg = `error code:${validation.status}`;
                    notify("Bundler Error", result.reason);
                    throw new Error(errMsg);
                }
            }

            const result = validation.result as IValidationResult;
            if (result.returnInfo.sigFailed) {
                throw new Error(`signature error`);
            }

            const bundlerEvent = bundler.sendUserOperation(operation);
            bundlerEvent.on("error", (err: any) => {
                notify("Bundler Error", "");
                throw new Error("Bundler Error");
            });
            bundlerEvent.on("send", (userOpHash: string) => {
                notify("Trsanction sent", "Your transaction was sent to bundler");
                console.log("sent: " + userOpHash);
            });
            bundlerEvent.on("receipt", async (receipt: IUserOpReceipt) => {
                console.log("receipt: ", receipt);
                const txHash: string = receipt.receipt.transactionHash;
                if (tabId) {
                    browser.tabs.sendMessage(Number(tabId), {
                        target: "soul",
                        type: "response",
                        action: "signTransaction",
                        data: txHash,
                        tabId,
                    });
                }

                notify("Trsanction success", "Your transaction was confirmed on chain");

                resolve(receipt.receipt);
            });
            bundlerEvent.on("timeout", () => {
                console.log("timeout");
            });
        } catch (err) {
            reject(err);
        }
    });
};
