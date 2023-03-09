/**
 * Arbitrum Goerli
 */

import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.svg";

export const usdcAddress = "0xe34a90dF83c29c28309f58773C41122d4E8C757A";

export const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        payable: true,
    },
    {
        icon: IconUSDC,
        symbol: "USDC",
        address: usdcAddress,
        decimals: 6,
        payable: true,
    },
];

export default {
    assetsList,
    recoverUrl: "http://soulwallets.me/recover",
    provider: `https://goerli-rollup.arbitrum.io/rpc`,
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://goerli.arbiscan.io/",
    // should it override state when we set new?
    defaultBundlerUrl: "https://bundler-arb-goerli.soulwallets.me/rpc",
    // IMPORTANT TODO, remove
    maxCostMultiplier: 2,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 421613,
    chainIdHex: `0x${(421613).toString(16)}`,
    chainName: "Arb Goerli",
    support1559: true,
    tokens: {
        usdc: usdcAddress,
    },
    contracts: {
        walletLogic: "0x4b7E8091c329059eD05885A0aa9D6A7F366440ea",
        guardianLogic: "0x9c092644ffCdd129695598672E71760611eE5eF3",
        entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
        paymaster: "0x7E828b1BEeB30C4dB36E268A94daBC0111E80600",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
