/**
 * Arbitrum
 */

import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.svg";
import IconDAI from "@src/assets/tokens/dai.png";
import IconUSDT from "@src/assets/tokens/usdt.png";
import IconMAI from "@src/assets/tokens/mai.png";

const paymasterToken_DAI = "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1";
const paymasterToken_USDC = "0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8";
const paymasterToken_USDT = "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9";
const paymasterToken_MAI = "0x3F56e0c36d275367b8C502090EDF38289b3dEa0d";

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
        icon: IconMAI,
        symbol: "MAI",
        address: paymasterToken_MAI,
        name: "Mai Stablecoin",
        decimals: 18,
        payable: false,
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
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://arbiscan.io",
    providerEth: "https://eth.llamarpc.com",
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
        walletLogic: "0x37E74B160Aeb56E958A34f0e441cAB3023ff4784",
        guardianLogic: "0xebf0e763d87BA132AfC22f25437a71E130292FAD",
        entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
        paymaster: "0x7F9b24C77f8806C6334981B4D1d9070c8d4B9c91",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
