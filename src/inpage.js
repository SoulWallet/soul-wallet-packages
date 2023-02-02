// @ts-nocheck
import Bus from "./lib/Bus";
import { JsonRpcEngine } from "json-rpc-engine";

import { providerFromEngine } from "eth-json-rpc-middleware";
import createInfuraMiddleware from "eth-json-rpc-infura";
import createSoulMiddleware from "./provider/createSoulMiddleware";
import shouldInjectProvider from "./provider/provider-injection";
import handleRequests from "./provider/handleRequests";

const soulMiddleware = createSoulMiddleware({
    getAccounts: async () => {
        const res = await Bus.send("getAccounts", "getAccounts");
        return [res];
    },
    processTransaction: async (txData) => {
        const opData = await Bus.send("approve", "approveTransaction", txData);

        opData.actionName = "Transaction";

        try {
            return await Bus.send("execute", "signTransaction", opData);
        } catch (err) {
            throw new Error("Failed to execute");
        }
    },
    processEthSignMessage: () => {},
    processTypedMessage: () => {},
    processTypedMessageV3: () => {},
    processTypedMessageV4: () => {},
    processPersonalMessage: () => {},
    processDecryptMessage: () => {},
    processEncryptionPublicKey: () => {},
});

const engine = new JsonRpcEngine();

engine.push(soulMiddleware);

engine.push(
    createInfuraMiddleware({
        network: "goerli",
        projectId: "be71e669fc24426aa39ca6c212bf58c9",
    }),
);

const provider = providerFromEngine(engine);

if (shouldInjectProvider()) {
    const providerToInject = {
        chainId: "0x5",
        isMetamask: true,
        request: async (call) => {
            return await handleRequests(call);
        },
        enable: async () => {
            const res = await Bus.send("getAccounts", "getAccounts");
            return [res];
        },
        ...provider,
    };

    window.ethereum = providerToInject;
    window.soul = providerToInject;
}
