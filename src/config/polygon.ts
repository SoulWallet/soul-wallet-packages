/**
 * Polygon
 */

// import IconETH from "@src/assets/tokens/eth.svg";
import IconMATIC from "@src/assets/tokens/matic.png";
import IconUSDC from "@src/assets/tokens/usdc.svg";
import IconDAI from "@src/assets/tokens/dai.png";
import IconUSDT from "@src/assets/tokens/usdt.png";

const paymasterToken_DAI = "0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063";
const paymasterToken_USDC = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const paymasterToken_USDT = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";

export const assetsList = [
    // {
    //     icon: IconETH,
    //     name: "ETH",
    //     symbol: "ETH",
    //     address: "0x0000000000000000000000000000000000000000",
    //     decimals: 18,
    //     payable: true,
    //     paymaster: false,
    // },
    {
        icon: IconMATIC,
        name: "MATIC",
        symbol: "MATIC",
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
    provider: `https://rpc-mainnet.matic.quiknode.pro`,
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://polygonscan.com/",
    // should it override state when we set new?
    defaultBundlerUrl: "https://bundler-polygon-main.soulwallets.me/rpc",
    maxCostMultiplier: 120,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 137,
    defaultBaseFee: "100000000",
    defaultMaxFee: "135000000",
    defaultMaxPriorityFee: "0",
    chainIdHex: `0x${(137).toString(16)}`,
    chainName: "Polygon",
    chainToken: "MATIC",
    addressPrefix: "matic:",
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
