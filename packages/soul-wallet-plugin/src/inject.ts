// @ts-nocheck
import Web3 from "web3";
import config from "./config";
import ProviderEngine from "web3-provider-engine";
import CacheSubprovider from "web3-provider-engine/subproviders/cache.js";
import FixtureSubprovider from "web3-provider-engine/subproviders/fixture.js";
import FilterSubprovider from "web3-provider-engine/subproviders/filters.js";
import VmSubprovider from "web3-provider-engine/subproviders/vm.js";
import HookedWalletSubprovider from "web3-provider-engine/subproviders/hooked-wallet.js";
import NonceSubprovider from "web3-provider-engine/subproviders/nonce-tracker.js";
import RpcSubprovider from "web3-provider-engine/subproviders/rpc.js";

var engine = new ProviderEngine();

window.web3 = new Web3(config.provider);

// static results
engine.addProvider(
    new FixtureSubprovider({
        web3_clientVersion: "ProviderEngine/v0.0.0/javascript",
        net_listening: true,
        eth_hashrate: "0x00",
        eth_mining: false,
        eth_syncing: true,
    }),
);

// cache layer
engine.addProvider(new CacheSubprovider());

// filters
engine.addProvider(new FilterSubprovider());

// pending nonce
engine.addProvider(new NonceSubprovider());

// vm
engine.addProvider(new VmSubprovider());

// id mgmt
engine.addProvider(
    new HookedWalletSubprovider({
        getAccounts: function (cb) {
            window.postMessage({
                target: "soul",
                type: "getAccounts",
                action: "getAccounts",
                data: {
                    origin: location.origin,
                },
            });
            window.addEventListener(
                "message",
                (msg) => {
                    if (
                        msg.data.type === "response" &&
                        msg.data.action === "getAccounts"
                    ) {
                        cb(null, [msg.data.data]);
                    }
                },
                false,
            );
        },
        approveTransaction: function (msg) {
            console.log("approve", msg);
            window.postMessage({
                target: "soul",
                type: "sign",
                action: "approveTransaction",
                data: {
                    origin: location.origin,
                    data: msg.data,
                    to: msg.to,
                },
            });
        },
        signTransaction: function (cb) {
            console.log("sign");
        },
    }),
);

// data source
engine.addProvider(
    new RpcSubprovider({
        rpcUrl: config.provider,
    }),
);

// log new blocks
// engine.on("block", function (block) {
//     console.log("BLOCK CHANGED:", "#" + block.number.toString("hex"));
// });

// network connectivity error
engine.on("error", function (err) {
    // report connectivity errors
    console.error(err.stack);
});

// start polling for blocks
// engine.start();

window.soul = {
    enable: () => {
        engine.start();
        window.soul = engine;
    },
};
