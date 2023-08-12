import windowBus from "../lib/windowBus";
import { ethers } from "ethers";
import { getMessageType } from "./tools";
import WalletABI from "@src/abi/Wallet.json";
import config from "@src/config";

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

const estimateGas = async (provider: any, params: any) => {
    return await provider.estimateGas(params[0]);
};

const gasPrice = async (provider: any) => {
    const feeData = await provider.getFeeData();

    // TODO, changed
    return feeData.gasPrice?.toString();
};

const getCode = async (provider: any, params: any) => {
    return await provider.getCode(params[0], params[1]);
};

const getBalance = async (provider:any, params: any) => {
    return await provider.getBalance(params[0], params[1]);
};

const getTransactionReceipt = async (provider:any, params: any) => {
    return await provider.getTransactionReceipt(params[0]);
};

const getTransactionByHash = async (provider:any, params: any) => {
    return await provider.getTransaction(params[0]);
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

const personalRecover = async (provider: any, params: string[]) => {
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
    const walletContract = new ethers.Contract(walletAddress as string, WalletABI, provider);
    const isValid = await walletContract.isValidSignature(msgHash, signature);

    if (isValid === config.magicValue) {
        return walletAddress;
    }
};

const chainId = async (chainConfig: any) => {
    return chainConfig.chainIdHex;
};

const blockNumber = async (provider: any, ) => {
    return await provider.getBlockNumber();
};

const ethCall = async (provider: any, params: any) => {
    console.log("params", params);
    // return await ethersProvider.call(params[0], params[1]);
    // TODO, realize this
    return await provider.call({});
};

export default async function handleRequests(call: any, chainConfig: any) {
    const { method, params } = call;

    // TODO, construct only once
    const provider = new ethers.JsonRpcProvider(chainConfig.provider);

    switch (method) {
        case "eth_chainId":
            return await chainId(chainConfig);
        case "eth_blockNumber":
            return await blockNumber(provider);
        case "eth_accounts":
            return await getAccounts();
        case "eth_requestAccounts":
            return await getAccounts();
        case "eth_sendTransaction":
            return await sendTransaction(params);
        case "eth_estimateGas":
            return await estimateGas(provider, params);
        case "eth_call":
            return await ethCall(provider, params);
        case "eth_getCode":
            return await getCode(provider, params);
        case "eth_getBalance":
            return await getBalance(provider, params);
        case "eth_gasPrice":
            return await gasPrice(provider);
        case "eth_getTransactionReceipt":
            return await getTransactionReceipt(provider, params);
        case "eth_getTransactionByHash":
            return await getTransactionByHash(provider, params);
        case "personal_sign":
            return await personalSign(params);
        case "personal_ecRecover":
            return await personalRecover(provider, params);
        case "eth_signTypedData_v4":
            return await signTypedDataV4(params);
        case "wallet_switchEthereumChain":
            console.log("Not supported yet");
            return true;
    }
}
