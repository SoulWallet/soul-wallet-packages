import { SoulWalletLib } from "soul-wallet-lib";
import { ethers } from "ethers";
import ky from "ky";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, notify, setLocalStorage } from "@src/lib/tools";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

const soulWalletLib = new SoulWalletLib();

const bundler = new soulWalletLib.Bundler(
    config.contracts.entryPoint,
    ethersProvider,
    config.bundlerUrl,
);

export const saveActivityHistory = async (history: any) => {
    let prev = (await getLocalStorage("activityHistory")) || [];
    prev.unshift(history);
    await setLocalStorage("activityHistory", prev);
};

export const executeTransaction = async (
    operation: any,
    requestId: any,
    actionName: any,
    tabId: any,
) => {
    return new Promise(async (resolve, reject) => {
        try {
            console.log("before simulate", operation);
            const result = await bundler.simulateHandleOp(
                config.contracts.entryPoint,
                operation,
            );

            // IMPORTANT TODO, catch errors and return
            console.log(`SimulateValidation:`, result);

            // failed to simulate
            if (!result) {
                return;
            }

            const aaa = await bundler.sendUserOperation(operation);

            // create raw_data for bundler api
            // const raw_data = soulWalletLib.RPC.eth_sendUserOperation(
            //     operation,
            //     config.contracts.entryPoint,
            // );
            // send to bundler

            // const res: any = await ky
            //     .post(config.bundlerUrl, { json: JSON.parse(raw_data) })
            //     .json();

            // // sent to bundler
            // if (res.result && res.result === requestId) {
            //     // get pending
            //     const pendingArr =
            //         await soulWalletLib.RPC.waitUserOperation(
            //             ethersProvider,
            //             config.contracts.entryPoint,
            //             requestId,
            //         );

            //     // if op is triggered by user and need a feedback. todo, what if 0
            //     if (tabId && pendingArr) {
            //         browser.tabs.sendMessage(Number(tabId), {
            //             target: "soul",
            //             type: "response",
            //             action: "signTransaction",
            //             // TODO, must 0?
            //             data: pendingArr[0].transactionHash,
            //             tabId,
            //         });
            //     }

            //     // get done
            //     const doneArr = await soulWalletLib.RPC.waitUserOperation(
            //         ethersProvider,
            //         config.contracts.entryPoint,
            //         requestId,
            //         1000 * 60 * 10,
            //         0,
            //         "latest",
            //     );

            //     if (doneArr) {
            //         // save to activity history
            //         await saveActivityHistory({
            //             actionName,
            //             txHash: doneArr[0].transactionHash,
            //         });

            //         // TODO, what if fail, add error hint
            //         notify(
            //             "Trsanction success",
            //             "Your transaction was confirmed on chain",
            //         );

            //         resolve(doneArr[0]);
            //     }
            // }
        } catch (err) {
            notify("Error", "Failed to send to bundler");
            reject(err);
        }
    });
};
