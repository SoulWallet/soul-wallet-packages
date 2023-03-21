/**
 * Goerli
 */

import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.svg";

export const usdcAddress = "0x55dFb37E7409c4e2B114f8893E67D4Ff32783b35";

export const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
        decimals: 18,
        payable: true,
        paymaster: false,
    },
    {
        icon: IconUSDC,
        symbol: "USDC",
        address: usdcAddress,
        decimals: 6,
        payable: true,
        paymaster: true,
    },
];

export default {
    assetsList,
    recoverUrl: "http://soulwallet.io/recover",
    provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    backendURL: "https://dev.internalversion.api.soulwallets.me",
    soulScanURL: "https://api.4337scan.dev.soulwallets.me",
    scanUrl: "https://goerli.etherscan.io",
    // should it override state when we set new?
    defaultBundlerUrl: "https://bundler-eth-goerli.soulwallets.me/rpc",
    // IMPORTANT TODO, remove
    maxCostMultiplier: 110,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 5,
    chainIdHex: (5).toString(16),
    chainName: "Goerli",
    defaultBaseFee: "100000000",
    defaultMaxFee: "1700000000",
    defaultMaxPriorityFee: "1500000000",
    support1559: true,
    tokens: {
        usdc: usdcAddress,
    },
    contracts: {
        walletLogic: "0x7b133bC3bFA502E7510B21B798796641fD76e9fb",
        guardianLogic: "0x0C549EDdf533F3f63e1E5C2Ae2fbEa805F432078",
        entryPoint: "0x0576a174D229E3cFA37253523E645A78A0C91B57",
        paymaster: "0xec6ef1336500Dc91660C367A2F86A7414b9d472c",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
