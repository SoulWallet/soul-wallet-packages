// @ts-nocheck
/**
 * @notice
 * 1. web3.js is not compatiable with service worker
 *
 */

import browser from "webextension-polyfill";
import ky from "ky";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { WalletLib } from "soul-wallet-lib";
import { ethers } from "ethers";
import config from "@src/config";
import { EntryPointAbi } from "./abi";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

const saveActivityHistory = async (history: any) => {
    let prev = (await getLocalStorage("activityHistory")) || [];
    prev.unshift(history);
    await setLocalStorage("activityHistory", prev);
};

const simulateValidation = async (userOp) => {
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

const executeTransaction = async (operation, requestId, actionName, tabId) => {
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

    const res = await ky
        .post(config.bundlerUrl, { json: JSON.parse(raw_data) })
        .json();

    // // sent to bundler
    if (res.result && res.result === requestId) {
        // get pending
        const pendingArr = await WalletLib.EIP4337.RPC.waitUserOperation(
            ethersProvider,
            config.contracts.entryPoint,
            requestId,
        );

        console.log('pending arr', pendingArr)

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
            null,
            null,
            "latest",
        );

        console.log('done', doneArr)

        if (doneArr) {
            // save to activity history
            await saveActivityHistory({
                actionName,
                txHash: doneArr[0].transactionHash,
            });

            // TODO, what if fail, add error hint
            const notifyId = Math.ceil(Math.random() * 1000).toString();
            browser.notifications.create(notifyId, {
                type: "basic",
                iconUrl: "../icon-48.png",
                title: "Trsanction success",
                message: "Your transaction was confirmed on chain",
            });
        }
    }
};

browser.runtime.onMessage.addListener(async (msg) => {
    // get current active tab
    const [tab] = await browser.tabs.query({
        active: true,
        currentWindow: true,
    });

    switch (msg.type) {
        case "response":
            browser.tabs.sendMessage(Number(msg.tabId), msg);
            break;
        case "getAccounts":
            // if already allowed getting accounts, don't show popup
            const walletAddress = await getLocalStorage("activeWalletAddress");
            const accountsAllowed =
                (await getLocalStorage("accountsAllowed")) || {};

            if (
                accountsAllowed[walletAddress] &&
                accountsAllowed[walletAddress].includes(msg.data.origin)
            ) {
                browser.tabs.sendMessage(Number(tab.id), {
                    target: "soul",
                    type: "response",
                    action: "getAccounts",
                    data: walletAddress,
                    tabId: tab.id,
                });
            } else {
                // if user never allowed access
                browser.windows.create({
                    url: `${msg.url}&tabId=${tab.id}&origin=${msg.data.origin}`,
                    type: "popup",
                    ...msg.pos,
                });
            }

            break;
        case "approve":
            const {
                origin,
                data,
                from,
                to,
                value,
                gas,
                maxFeePerGas,
                maxPriorityFeePerGas,
            } = msg.data;

            browser.windows.create({
                url: `${msg.url}&tabId=${tab.id}&origin=${origin}&data=${data}&from=${from}&to=${to}&value=${value}&gas=${gas}&maxFeePerGas=${maxFeePerGas}&maxPriorityFeePerGas=${maxPriorityFeePerGas}`,
                type: "popup",
                ...msg.pos,
            });
            break;

        case "execute":
            const { actionName, operation, requestId, tabId } = msg.data;
            const parsedOperation = JSON.parse(operation);

            await executeTransaction(
                parsedOperation,
                requestId,
                actionName,
                tabId,
            );
    }
});
