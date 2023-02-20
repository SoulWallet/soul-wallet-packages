import Bus from "../lib/Bus";
import { ethers } from "ethers";
import config from "@src/config";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

const getAccounts = async () => {
    return [await Bus.send("getAccounts", "getAccounts")];
};

const sendTransaction = async (params: any) => {
    let param = params[0];

    // TODO, needs to be calculated
    param.maxFeePerGas = param.gas;
    param.maxPriorityFeePerGas = param.gas;

    if (!param.value) {
        param.value = "0x0";
    }

    const opData: any = await Bus.send("approve", "approveTransaction", param);

    opData.actionName = "Transaction";

    try {
        return await Bus.send("execute", "signTransaction", opData);
    } catch (err) {
        throw new Error("Failed to execute");
    }
};

const estimateGas = async (params: any) => {
    return (await ethersProvider.estimateGas(params[0]))._hex;
};

const gasPrice = async () => {
    return (await ethersProvider.getGasPrice())._hex;
};

const getTransactionReceipt = async (params: any) => {
    return await ethersProvider.getTransactionReceipt(params[0]);
};

const getTransactionByHash = async (params: any) => {
    const tx = await ethersProvider.getTransaction(params[0]);
    return tx;
};

const chainId = async () => {
    return "0x5";
};

const blockNumber = async () => {
    return await ethersProvider.getBlockNumber();
};

const ethCall = async (params: any) => {
    return await ethersProvider.call(params[0], params[1]);
};

export default async function handleRequests(call: any) {
    const { method, params } = call;
    console.log("got request", call);
    switch (method) {
        case "eth_chainId":
            return await chainId();
        case "eth_blockNumber":
            return await blockNumber();
        case "eth_accounts":
            return await getAccounts();
        case "eth_requestAccounts":
            return await getAccounts();
        case "eth_sendTransaction":
            return await sendTransaction(params);
        case "eth_estimateGas":
            return await estimateGas(params);
        case "eth_call":
            return await ethCall(params);
        case "eth_gasPrice":
            return await gasPrice();
        case "eth_getTransactionReceipt":
            return await getTransactionReceipt(params);
        case "eth_getTransactionByHash":
            return await getTransactionByHash(params);
        // TODO, signature
    }
}
