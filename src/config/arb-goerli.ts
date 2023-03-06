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
    defaultSalt: 0,
    feeMultiplier: 3,
    // IMPORTANT TODO, remove
    maxCostMultiplier: 5,
    defaultTip: 10 * 10 ** 9,
    upgradeDelay: 10,
    guardianDelay: 100,
    guardianSalt: "",
    chainId: 421613,
    chainIdHex: (421613).toString(16),
    chainName: 'Arb Goerli',
    support1559: true,
    tokens: {
        usdc: usdcAddress,
    },
    contracts: {
        walletLogic: "0x7b133bC3bFA502E7510B21B798796641fD76e9fb",
        guardianLogic: "0x0C549EDdf533F3f63e1E5C2Ae2fbEa805F432078",
        entryPoint: "0xA19e1F46d9CFbc1557300bb93F96D76EA1FF2a69",
        paymaster: "0x2468548008E7Aa766b9fFE66402892AC13Cbeb12",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
