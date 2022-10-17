// @ts-nocheck

const { JsonRpcEngine } = require("json-rpc-engine");
const { providerAsMiddleware } = require("eth-json-rpc-middleware");
const createInfuraMiddleware = require("eth-json-rpc-infura");

const engine = new JsonRpcEngine();
// engine.push(providerAsMiddleware);
engine.push(
    createInfuraMiddleware({
        network: "goerli",
        projectId: "be71e669fc24426aa39ca6c212bf58c9",
    }),
);

window.soul = engine;
