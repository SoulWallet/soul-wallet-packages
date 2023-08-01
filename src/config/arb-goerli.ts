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
    provider: `https://arb-mainnet-public.unifra.io`,
    l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://arbiscan.io/",
    // should it override state when we set new?
    defaultBundlerUrl: "https://bundler-arb-main.soulwallets.me/rpc",
    maxCostMultiplier: 120,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 42161,
    defaultBaseFee: "100000000",
    defaultMaxFee: "135000000",
    defaultMaxPriorityFee: "0",
    chainIdHex: `0x${(42161).toString(16)}`,
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
        l1Keystore: "0x7a7d3f06a81fe2e4a4c3955be074fe67d9dd91e3",
        
        keyStoreModule: "0xfeaab278ed3093f208627b9361dcd15a2a655eca",
        soulWalletFactory: "0x13138762dbc79b8fc9c925f4b3afb3d6598c3a7b",
        defaultCallbackHandler: "0xa35ce0dde330f3e6eccc56cf6a3f336eecb339bb",
        securityControlModule: "0xe064b1a36c9dfa21cfbe7819661933a954122d95",

        walletLogic: "0x",
        guardianLogic: "0x",
        entryPoint: "0x",
        paymaster: "0x",
        create2Factory: "0x",
    },
};
