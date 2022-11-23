// @ts-nocheck
/**
 * @notice
 * 1. web3.js is not compatiable with service worker
 *
 */

import browser from "webextension-polyfill";
// import ky from "ky";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
// import { WalletLib } from "soul-wallet-lib";
import { Utils } from "./Utils";
import config from "@src/config";


const saveActivityHistory = async (history: any) => {
    let prev = (await getLocalStorage("activityHistory")) || [];
    prev.unshift(history);
    await setLocalStorage("activityHistory", prev);
};

const executeTransaction = async (operation, requestId, actionName, tabId) => {
    // create raw_data for bundler api
    // const raw_data = WalletLib.EIP4337.RPC.eth_sendUserOperation(
    //     operation,
    //     config.contracts.entryPoint,
    // );
    // // send to bundler
    // const res = await ky.post(config.bundlerUrl, { json: raw_data }).json();
    // // sent to bundler
    // if (res.data && res.data.result === requestId) {
    //     const arr = await WalletLib.EIP4337.RPC.waitUserOperation(
    //         web3 as any,
    //         config.contracts.entryPoint,
    //         requestId,
    //         1000 * 60 * 1,
    //         (await web3.eth.getBlockNumber()) - 500,
    //     );
    //     console.log("event list", arr);
    //     console.log("send back tabId", Number(tabId), arr);
    //     // save to activity history
    //     await saveActivityHistory({
    //         actionName,
    //         txHash: txHash,
    //     });
    //     browser.tabs.sendMessage(Number(tabId), {
    //         target: "soul",
    //         type: "response",
    //         action: "signTransaction",
    //         data: arr[0],
    //         tabId,
    //     });
    //     // TODO, what if fail, add error hint
    //     const notifyId = Math.ceil(Math.random() * 1000).toString();
    //     browser.notifications.create(notifyId, {
    //         type: "basic",
    //         iconUrl: "../icon-48.png",
    //         title: "Trsanction success",
    //         message: "Your transaction was confirmed on chain",
    //     });
    // }
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

        // format data then execute tx
        case "signTx":

        const {
            data,
            gas,
            maxFeePerGas,
            maxPriorityFeePerGas,
            from,
            to,
            value,
        } = msg.data;

        const nonce = await Utils.getNonce(from);

        console.log('before from tx')

        const operation = Utils.fromTransaction(
            {
                data,
                from,
                gas,
                to,
                value,
            },
            nonce,
            maxFeePerGas,
            maxPriorityFeePerGas,
            config.contracts.paymaster,
        );

        // const requestId = operation.getRequestId(
        //     config.contracts.entryPoint,
        //     config.chainId,
        // );

        // const signature = await keyStore.sign(requestId);

        // console.log("signed signature", signature);

        // if (!signature) {
        //     return;
        // }

        // operation.signWithSignature(account, signature || "");

        // const entryPointContract = new web3.eth.Contract(
        //     EntryPointABI,
        //     config.contracts.entryPoint,
        // );

        // const result = await entryPointContract.methods
        //     .simulateValidation(operation)
        //     .call({
        //         from: WalletLib.EIP4337.Defines.AddressZero,
        //     });

        // IMPORTANT TODO, catch errors
        // console.log(`SimulateValidation:`, result);

        // todo
        // const actionName = "Transaction";

        // await executeTransaction(operation, requestId, actionName, tab.id);
    }
});
