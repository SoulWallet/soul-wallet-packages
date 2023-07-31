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
    maxCostMultiplier: 110,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 5,
    chainIdHex: (5).toString(16),
    chainName: "Goerli",
    chainToken: "ETH",
    addressPrefix: "gor:",
    defaultBaseFee: "100000000",
    defaultMaxFee: "1700000000",
    defaultMaxPriorityFee: "1500000000",
    support1559: true,
    tokens: {
        usdc: usdcAddress,
    },
    contracts: {
        l1Keystore: "",
        soulWalletFactory: "",
        defaultCallbackHandler:"",
        keyStoreModule:"",
        securityControlModule: "",

        walletLogic: "0x",
        guardianLogic: "0x",
        entryPoint: "0x",
        paymaster: "0x",
        create2Factory: "0x",
    },
};
