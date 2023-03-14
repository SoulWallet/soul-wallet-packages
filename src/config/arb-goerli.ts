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
    maxCostMultiplier: 200,
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
        walletLogic: "0x9F8241410C00a24Bf2eFE5bf42226645fb1F3839",
        guardianLogic: "0x1277450427963DeB16CfEB8c58C4aC55F33A5c89",
        entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
        paymaster: "0xB6Bc5912cF87c29524c82Bc3E1dF1C98e2AAAf59",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
