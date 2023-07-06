// @ts-nocheck
import windowBus from "./lib/windowBus";
import config from "./config";
import { JsonRpcEngine } from "json-rpc-engine";
import { Emitter } from "strict-event-emitter";
import handleRequests from "./provider/handleRequests";

const emitter = new Emitter();

const engine = new JsonRpcEngine();

const provider = engine;

const providerToInject = {
    chainId: config.chainIdHex,
    isMetaMask: true,
    isWeb3: true,
    isSoul: true,
    request: async (call) => {
        return await handleRequests(call);
    },
    sendAsync: async (call, fn) => {
        const result = await handleRequests(call);
        fn(null, { result });
    },
    enable: async () => {
        const res = await windowBus.send("getAccounts", "getAccounts");
        return [res];
    },
    on: (eventName) => {
        console.log("listen to event name", eventName);
        emitter.addListener(eventName, (data) => {
            return data;
        });
        // message
        // connect
        // error
        // disconnect
        // close
        // accountsChanged
        // chainChanged
        // emitter.on(eventName, (data) => {
        //     console.log("got event name", eventName);
        //     return data;
        // });
    },
    ...provider,
};

// const proxiedProvider = new Proxy(providerToInject, {});
const injectProvider = async () => {
    const shouldInject = await windowBus.send("shouldInject", "shouldInject");
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
