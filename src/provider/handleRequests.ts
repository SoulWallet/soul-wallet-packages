import Bus from "../lib/Bus";
import { ethers } from "ethers";
import { getMessageType } from "./tools";
// import WalletABI from "@src/abi/Wallet.json";
import config from "@src/config";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

const getAccounts = async () => {
    return [await Bus.send("getAccounts", "getAccounts")];
};

const sendTransaction = async (params: any) => {
    let param = params[0];

    if (!param.value) {
        param.value = "0x0";
    }

    const opData: any = await Bus.send("approve", "approveTransaction", param);

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
    return await ethersProvider.getTransaction(params[0]);
};

const signTypedDataV4 = async (params: any) => {
    // console.log("sign params", params);
    // return await Bus.send("signMessage", "signMessageV4", {
    //     data: params.data,
    // });
    // console.log('Or', params)

    return await Bus.send("signMessageV4", "signMessageV4", {
        data: params[1],
    });
};

const personalSign = async (params: any) => {
    const msg = params[0];
    const msgToSign = getMessageType(params[0]) === "hash" ? msg : ethers.utils.toUtf8String(msg);
    return await Bus.send("signMessage", "signMessage", {
        data: msgToSign,
    });
};

const personalRecover = async (params: any) => {
    // console.log("params", params);
    // const walletAddress = await Bus.send("getAccounts", "getAccounts");
    // const walletContract = new ethers.Contract(walletAddress as string, WalletABI);
    // const isValid = await walletContract.isValidSignature(params[0], params[1]);
    // console.log("is valid", isValid);
    // return "0xA43A022A6283b1d5CD602f3834C611074af85124";
    // return await Bus.send("personalRecover", "personalRecover", {
    //     data: params
    // });
};

const chainId = async () => {
    return config.chainIdHex;
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
