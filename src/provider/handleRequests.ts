import windowBus from "../lib/windowBus";
import { ethers } from "ethers";
import { getMessageType } from "./tools";
import WalletABI from "@src/abi/Wallet.json";
import config from "@src/config";

const ethersProvider = new ethers.JsonRpcProvider(config.provider);

const getAccounts = async () => {
    console.log("get account 2");
    return [await windowBus.send("getAccounts", "getAccounts")];
};

const sendTransaction = async (params: any) => {
    params.forEach((item: any) => {
        if (!item.value) {
            item.value = "0x0";
        }
    });

    const opData: any = await windowBus.send("approve", "approveTransaction", { txns: params });

    try {
        return await windowBus.send("execute", "signTransaction", opData);
    } catch (err) {
        throw new Error("Failed to execute");
    }
};

const estimateGas = async (params: any) => {
    return await ethersProvider.estimateGas(params[0]);
};

const gasPrice = async () => {
    const feeData = await ethersProvider.getFeeData();

    // TODO, changed
    return feeData.gasPrice?.toString();
};

const getCode = async (params: any) => {
    return await ethersProvider.getCode(params[0], params[1]);
};

const getBalance = async (params: any) => {
    return await ethersProvider.getBalance(params[0], params[1]);
};

const getTransactionReceipt = async (params: any) => {
    return await ethersProvider.getTransactionReceipt(params[0]);
};

const getTransactionByHash = async (params: any) => {
    return await ethersProvider.getTransaction(params[0]);
};

const signTypedDataV4 = async (params: any) => {
    const res = await windowBus.send("signMessageV4", "signMessageV4", {
        data: params[1],
    });
    console.log("signTypeV4 sig: ", res);
    return res;
};

const personalSign = async (params: any) => {
    const msg = params[0];
    // const msgToSign = getMessageType(params[0]) === "hash" ? msg : ethers.utils.toUtf8String(msg);
    // console.log('before send personal sign', msgToSign)
    const res = await windowBus.send("signMessage", "signMessage", {
        data: msg,
    });
    return res;
};

const personalRecover = async (params: string[]) => {
    // judge msg type
    const msgType = getMessageType(params[0]);
    const signature = params[1];

    let msgHash = "";

    if (msgType === "text") {
        const text = ethers.toUtf8String(params[0]);
        msgHash = ethers.hashMessage(text);
    } else if (msgType === "hash") {
        msgHash = params[0];
    }

    const walletAddress = await windowBus.send("getAccounts", "getAccounts");
    const walletContract = new ethers.Contract(walletAddress as string, WalletABI, ethersProvider);
    const isValid = await walletContract.isValidSignature(msgHash, signature);

    if (isValid === config.magicValue) {
        return walletAddress;
    }
};

const chainId = async () => {
    return config.chainIdHex;
};

const blockNumber = async () => {
    return await ethersProvider.getBlockNumber();
};

const ethCall = async (params: any) => {
    console.log("params", params);
    // return await ethersProvider.call(params[0], params[1]);
    return await ethersProvider.call({});
};

export default async function handleRequests(call: any) {
    const { method, params } = call;
    console.log("provider request: ", call);
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
        case "eth_getCode":
            return await getCode(params);
        case "eth_getBalance":
            return await getBalance(params);
        case "eth_gasPrice":
            return await gasPrice();
        case "eth_getTransactionReceipt":
            return await getTransactionReceipt(params);
        case "eth_getTransactionByHash":
            return await getTransactionByHash(params);
        case "personal_sign":
            return await personalSign(params);
        case "personal_ecRecover":
            return await personalRecover(params);
        case "eth_signTypedData_v4":
            return await signTypedDataV4(params);
        case "wallet_switchEthereumChain":
            console.log("Not supported yet");
            return true;
    }
}
