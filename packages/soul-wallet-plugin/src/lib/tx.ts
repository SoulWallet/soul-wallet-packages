import { WalletLib } from "soul-wallet-lib";
import { ethers } from "ethers";
import ky from "ky";
import browser from "webextension-polyfill";
import config from "@src/config";
import { getLocalStorage, notify, setLocalStorage } from "@src/lib/tools";
import { EntryPointAbi } from "../abi";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

export const saveActivityHistory = async (history: any) => {
    let prev = (await getLocalStorage("activityHistory")) || [];
    prev.unshift(history);
    await setLocalStorage("activityHistory", prev);
};

export const simulateValidation = async (userOp: any) => {
    console.log("User OP", userOp);

    const result = await ethersProvider.call({
        from: ethers.constants.AddressZero,
        to: config.contracts.entryPoint,
        data: new ethers.utils.Interface(EntryPointAbi).encodeFunctionData(
            "simulateValidation",
            [userOp, false],
        ),
    });

    // const decoded = new ethers.utils.Interface(
    //     EntryPointAbi,
    // ).decodeFunctionResult("simulateValidation", result);
    // console.log("decode simulate", decoded);

    return result;
};

export const executeTransaction = async (
    operation: any,
    requestId: any,
    actionName: any,
    tabId: any,
) => {
    return new Promise(async (resolve, reject) => {
        const result = await simulateValidation(operation);
        // // IMPORTANT TODO, catch errors and return
        console.log(`SimulateValidation:`, result);

        // failed to simulate
        if (!result) {
            return;
        }

        // create raw_data for bundler api
        const raw_data = WalletLib.EIP4337.RPC.eth_sendUserOperation(
            operation,
            config.contracts.entryPoint,
        );
        // send to bundler

        const res: any = await ky
            .post(config.bundlerUrl, { json: JSON.parse(raw_data) })
            .json();

        console.log('bundler res', res)

        if (!res) {
            notify("Error", "Failed to send to bundler");
        }

        // // sent to bundler
        if (res.result && res.result === requestId) {
            // get pending
            const pendingArr = await WalletLib.EIP4337.RPC.waitUserOperation(
                ethersProvider,
                config.contracts.entryPoint,
                requestId,
            );

            // if op is triggered by user and need a feedback. todo, what if 0
            if (tabId && pendingArr) {
                browser.tabs.sendMessage(Number(tabId), {
                    target: "soul",
                    type: "response",
                    action: "signTransaction",
                    // TODO, must 0?
                    data: pendingArr[0].transactionHash,
                    tabId,
                });
            }

            // get done
            const doneArr = await WalletLib.EIP4337.RPC.waitUserOperation(
                ethersProvider,
                config.contracts.entryPoint,
                requestId,
                1000 * 60 * 10,
                0,
                "latest",
            );

            if (doneArr) {
                // save to activity history
                await saveActivityHistory({
                    actionName,
                    txHash: doneArr[0].transactionHash,
                });

                // TODO, what if fail, add error hint
                notify(
                    "Trsanction success",
                    "Your transaction was confirmed on chain",
                );

                resolve(doneArr[0]);
            } else {
                // TODO, what if error
            }
        }
    });
};
