import { ethers } from "ethers";
import { SoulWallet, Bundler } from "@soulwallet/sdk";
import browser from "webextension-polyfill";
import config from "@src/config";

// TODO, move to store
const soulWallet = new SoulWallet(
    config.provider,
    config.defaultBundlerUrl,
    config.contracts.soulWalletFactory,
    config.contracts.defaultCallbackHandler,
    config.contracts.keyStoreModuleProxy,
    config.contracts.securityControlModule,
);

import { notify } from "@src/lib/tools";

const ethersProvider = new ethers.JsonRpcProvider(config.provider);

export const executeTransaction = async (userOp: any, tabId: any, bundlerUrl: any) => {
    console.log("User OP: ", userOp);

    const ret = await soulWallet.sendUserOperation(userOp);

    if (ret.isErr()) {
        throw new Error(ret.ERR.message);
    }

    const bundler = new Bundler(bundlerUrl);

    const userOpHashRet = await soulWallet.userOpHash(userOp);

    if (userOpHashRet.isErr()) {
        throw new Error(userOpHashRet.ERR.message);
    }

    const userOpHash = userOpHashRet.OK;

    return new Promise(async (resolve, reject) => {
        while (true) {
            const receipt = await bundler.eth_getUserOperationReceipt(userOpHash);
            if (receipt.isErr()) {
                throw new Error(receipt.ERR.message);
            }
            if (receipt.OK === null) {
                console.log("still waiting");
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
                if (receipt.OK.success) {
                    resolve(receipt.OK);
                } else {
                    throw new Error("tx failed");
                }
                break;
            }
        }
    });

    // return new Promise(async (resolve, reject) => {
    //     try {
    //         const validation = await bundler.simulateValidation(operation);

    //         console.log("validation result", validation);

    //         if (validation.status !== 0) {
    //             const result = validation.result as IFailedOp;
    //             if (validation.status === 1) {
    //                 notify("Bundler Error", result.reason);
    //                 throw new Error(result.reason);
    //             } else {
    //                 const errMsg = `error code:${validation.status}`;
    //                 notify("Bundler Error", result.reason);
    //                 throw new Error(errMsg);
    //             }
    //         }

    //         const result = validation.result as IValidationResult;
    //         console.log("result", result);

    //         if (result.returnInfo.sigFailed) {
    //             notify("Signature Error", "");
    //             throw new Error(`signature error`);
    //         }

    //         const bundlerEvent = bundler.sendUserOperation(operation);
    //         bundlerEvent.on("error", (err: any) => {
    //             console.log('err', err)
    //             notify("Bundler Error", "");
    //             throw new Error(err);
    //         });
    //         bundlerEvent.on("send", (userOpHash: string) => {
    //             notify("Transaction sent", "Your transaction was sent to bundler");
    //             console.log("sent: " + userOpHash);
    //         });
    //         bundlerEvent.on("receipt", async (receipt: IUserOpReceipt) => {
    //             console.log("receipt: ", receipt);
    //             const txHash: string = receipt.receipt.transactionHash;
    //             if (tabId) {
    //                 browser.tabs.sendMessage(Number(tabId), {
    //                     target: "soul",
    //                     type: "response",
    //                     action: "signTransaction",
    //                     data: txHash,
    //                     tabId,
    //                 });
    //             }

    //             notify("Transaction success", "Your transaction was confirmed on chain");

    //             resolve(receipt.receipt);
    //         });
    //         bundlerEvent.on("timeout", () => {
    //             console.log("timeout");
    //         });
    //     } catch (err) {
    //         reject(err);
    //     }
    // });
};
