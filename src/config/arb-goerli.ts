/**
 * Arbitrum
 */

import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.svg";
import IconDAI from "@src/assets/tokens/dai.png";
import IconUSDT from "@src/assets/tokens/usdt.png";

const paymasterToken_DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const paymasterToken_USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const paymasterToken_USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";

export const assetsList = [
    {
        icon: IconETH,
        name: "ETH",
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        payable: true,
        paymaster: false,
    },
    {
        icon: IconDAI,
        name: "Dai Stablecoin",
        symbol: "DAI",
        address: paymasterToken_DAI,
        decimals: 18,
        payable: true,
        paymaster: true,
    },
    {
        icon: IconUSDT,
        symbol: "USDT",
        name: "Tether USD",
        address: paymasterToken_USDT,
        decimals: 6,
        payable: true,
        paymaster: true,
    },
    {
        icon: IconUSDC,
        symbol: "USDC",
        address: paymasterToken_USDC,
        name: "USDCoin",
        decimals: 6,
        payable: true,
        paymaster: true,
    },
];

export default {
    assetsList,
    recoverUrl: "http://soulwallets.me/recover",
    provider: `https://arb-goerli.g.alchemy.com/v2/M3uND7od01QVjQN9Px8TCxnMcPRgWTCH`,
    l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://testnet.arbiscan.io/",
    // should it override state when we set new?
    defaultBundlerUrl: "https://bundler-arb-goerli.soulwallets.me/rpc",
    // defaultBundlerUrl: "https://arb-goerli.g.alchemy.com/v2/M3uND7od01QVjQN9Px8TCxnMcPRgWTCH",
    maxCostMultiplier: 120,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 42161,
    defaultMaxFee: "0.135",
    defaultMaxPriorityFee: "0",
    chainIdHex: `0x${(421613).toString(16)}`,
    chainName: "Arbitrum",
    chainToken: "ETH",
    addressPrefix: "arb:",
    support1559: true,
    tokens: {
        usdc: paymasterToken_USDC,
        dai: paymasterToken_DAI,
        usdt: paymasterToken_USDT,
    },
    contracts: {
        l1Keystore: "0xa0126a11877f3edb06cf6afac809f92d324007dc",
        
        keyStoreModule: "0x39e5aefbcd9949d1f1d0657d380ead45c0a2367d",
        soulWalletFactory: "0xa460c9695552d09ff6d9c93b2ea87fc606dc9900",
        defaultCallbackHandler: "0x2de0f1b7d3fbe2a86b88446acdbc294c91aa8f97",
        securityControlModule: "0xe9793d7792d3d736ecde0cc89050232704ad323e",

        walletLogic: "0x",
        guardianLogic: "0x",
        entryPoint: "0x",
        paymaster: "0x",
        create2Factory: "0x",
    },
};


