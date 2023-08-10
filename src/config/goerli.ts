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
    defaultMaxFee: "1700000000",
    defaultMaxPriorityFee: "1500000000",
    support1559: true,
    tokens: {
        usdc: usdcAddress,
    },
    contracts: {
        l1Keystore: "0x76a43ef7cc3b49736951759494d2aee8cae1cdec",
        keyStoreModule: "0x8600b46836b4b1d850bd121773ba6941cea85f78",
        keyStoreModuleProxy: "0x59b84bfaaa906a84152ded63d964cff913308921",
        soulWalletFactory: "0x576c13ccb03c21df9eeca0832719f0f6ffdc934b",
        defaultCallbackHandler: "0xb8466fa7777fbc8046fe92adab58736def8b4c8f",
        securityControlModule: "0x7a711e826b6383d6791cb43bfc0a4b72a2940183",
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        paymaster: "0xee4d0d07318dd076d588bccdf2383275b499f29f",
    },
};
