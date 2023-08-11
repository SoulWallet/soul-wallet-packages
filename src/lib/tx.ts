import { ethers } from "ethers";
import { SoulWallet, Bundler } from "@soulwallet/sdk";
import browser from "webextension-polyfill";
import config from "@src/config";
import BN from "bignumber.js";

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



// const ethersProvider = new ethers.JsonRpcProvider(config.provider);

export const executeTransaction = async (userOp: any, tabId: any, bundlerUrl: any) => {
    // printUserOp(userOp);
    return new Promise(async (resolve, reject) => {
        const ret = await soulWallet.sendUserOperation(userOp);

        if (ret.isErr()) {
            const errMsg = ret.ERR.message;
            notify("Bundler Error", errMsg);
            console.error(errMsg);
            reject(errMsg);
            return;
        }

        const bundler = new Bundler(bundlerUrl);

        const userOpHashRet = await soulWallet.userOpHash(userOp);

        if (userOpHashRet.isErr()) {
            const errMsg = userOpHashRet.ERR.message;
            console.error(errMsg);
            notify("Bundler Error", errMsg);
            reject(errMsg);
            return;
        }

        const userOpHash = userOpHashRet.OK;

        notify("Transaction sent", "Your transaction was sent to bundler");

        while (true) {
            const receipt = await bundler.eth_getUserOperationReceipt(userOpHash);
            console.log("RECEIPT", receipt);
            if (receipt.isErr()) {
                const errMsg = receipt.ERR.message;
                notify("Bundler Error", errMsg);
                reject(errMsg);
            }
            if (receipt.OK === null) {
                console.log("still waiting");
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
                console.log("receipt is", receipt);
                if (receipt.OK.success) {
                    if (tabId) {
                        browser.tabs.sendMessage(Number(tabId), {
                            target: "soul",
                            type: "response",
                            action: "signTransaction",
                            data: receipt.OK.receipt.hash,
                            tabId,
                        });
                    }
                    notify("Transaction success", "Your transaction was confirmed on chain");
                    resolve(receipt.OK);
                } else {
                    reject("tx failed");
                }
                break;
            }
        }
    });
    //         bundlerEvent.on("receipt", async (receipt: IUserOpReceipt) => {
    //             console.log("receipt: ", receipt);
    //             const txHash: string = receipt.receipt.transactionHash;

    //
};
