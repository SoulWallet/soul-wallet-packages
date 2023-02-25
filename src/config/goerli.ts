/**
 * Arbitrum Goerli
 */

import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.svg";

import Icon1inch from "@src/assets/dapps/1inch.svg";
import IconAave from "@src/assets/dapps/aave.svg";
import IconCurve from "@src/assets/dapps/curve.png";
import IconUniswap from "@src/assets/dapps/uniswap.svg";
import IconYearn from "@src/assets/dapps/yearn.svg";

export const infuraId = "36edb4e805524ba696b5b83b3e23ad18";

export const usdcAddress = "0x55dFb37E7409c4e2B114f8893E67D4Ff32783b35";

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

export const dappsList = [
    {
        icon: Icon1inch,
        title: "1inch",
        category: "DeFi",
        link: "https://app.1inch.io",
    },
    {
        icon: IconUniswap,
        title: "Uniswap",
        category: "DeFi",
        link: "https://app.uniswap.org/",
    },
    {
        icon: IconCurve,
        title: "Curve",
        category: "DeFi",
        link: "https://curve.fi",
    },
    {
        icon: IconYearn,
        title: "Yearn",
        category: "DeFi",
        link: "https://yearn.finance/",
    },
    {
        icon: IconAave,
        title: "Aave",
        category: "DeFi",
        link: "https://app.aave.com/",
    },
];

export default {
    assetsList,
    dappsList,
    recoverUrl: "http://localhost:8100/recover",
    provider: `https://goerli.infura.io/v3/${infuraId}`,
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://goerli.etherscan.io",
    // should it override state when we set new?
    defaultBundlerUrl: "https://bundler-eth-goerli.soulwallets.me/rpc",
    defaultSalt: 0,
    feeMultiplier: 3,
    maxCostMultiplier: 5,
    defaultTip: 10 * 10 ** 9,
    // TODO,
    upgradeDelay: 10,
    guardianDelay: 100,
    guardianSalt: "",
    chainId: 5,
    support1559: true,
    tokens: {
        usdc: usdcAddress,
    },
    contracts: {
        walletLogic: "0x3f081ac2F6BC12d07971C02D1A552c7283ba3375",
        guardianLogic: "0x0C549EDdf533F3f63e1E5C2Ae2fbEa805F432078",
        entryPoint: "0xA19e1F46d9CFbc1557300bb93F96D76EA1FF2a69",
        paymaster: "0x84C5C35d3b13951d5256262716E2ffD12AaBFa2c",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
