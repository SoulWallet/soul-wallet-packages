// @ts-nocheck
import Bus from "./lib/Bus";
import config from "../src/config";
import { JsonRpcEngine } from "json-rpc-engine";
import { providerFromEngine } from "eth-json-rpc-middleware";
// import createInfuraMiddleware from "eth-json-rpc-infura";
import createSoulMiddleware from "./provider/createSoulMiddleware";
// import shouldInjectProvider from "./provider/provider-injection";
import handleRequests from "./provider/handleRequests";

const soulMiddleware = createSoulMiddleware({
    getAccounts: async () => {
        const res = await Bus.send("getAccounts", "getAccounts");
        return [res];
    },
    processTransaction: async (txData) => {
        console.log("readyt to process in processTransaction", txData);
        const opData = await Bus.send("approve", "approveTransaction", txData);
        // opData.actionName = "Transaction";
        try {
            return await Bus.send("execute", "signTransaction", opData);
        } catch (err) {
            throw new Error("Failed to execute");
        }
    },
    processEthSignMessage: () => {
        console.log("sign.");
    },
    processTypedMessage: () => {
        console.log("sign.");
    },
    processTypedMessageV3: () => {
        console.log("sign.");
    },
    processTypedMessageV4: async (params) => {
        return await Bus.send("signMessageV4", "signMessageV4", {
            data: params.data,
        });
    },
    processPersonalMessage: () => {
        console.log("sign.");
    },
    processDecryptMessage: () => {
        console.log("sign.");
    },
    processEncryptionPublicKey: () => {
        console.log("sign.");
    },
});

const engine = new JsonRpcEngine();

engine.push(soulMiddleware);

const provider = providerFromEngine(engine);

const providerToInject = {
    chainId: config.chainIdHex,
    isMetaMask: true,
    isSoul: true,
    request: async (call) => {
        return await handleRequests(call);
    },
    enable: async () => {
        const res = await Bus.send("getAccounts", "getAccounts");
        return [res];
    },
    ...provider,
};

const injectProvider = async () => {
    const shouldInject = await Bus.send("shouldInject", "shouldInject");
    if (shouldInject) {
        window.ethereum = providerToInject;
        window.soul = providerToInject;
    }
};

injectProvider();
// const checkProvider = async () => {
//     console.log("check provider", window.ethereum);

//     // should get this from store
//     const isDefaultProvider = true;

//     if (isDefaultProvider && !window.ethereum.isSoul) {
//         window.ethereum = providerToInject;
//     }
// };

// setInterval(() => {
//     checkProvider();
// }, 3000);
