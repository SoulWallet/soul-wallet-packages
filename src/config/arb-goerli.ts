/**
 * Arbitrum Goerli
 */

import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.svg";

const erc20_USDC = "0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63";

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
        icon: IconUSDC,
        symbol: "USDC",
        address: erc20_USDC,
        name: "USDCoin",
        decimals: 6,
        payable: true,
        paymaster: true,
    },
];

export default {
    assetsList,
    recoverUrl: "http://soulwallets.me/recover",
    // provider: `https://arb-goerli.g.alchemy.com/v2/M3uND7od01QVjQN9Px8TCxnMcPRgWTCH`,
    provider: `https://arbitrum-goerli.publicnode.com`,
    l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    scanUrl: "https://testnet.arbiscan.io/",
    // should it override state when we set new?
    defaultBundlerUrl: "https://api-dev.soulwallet.io/bundler/arb-goerli/rpc",
    // defaultBundlerUrl: "https://arb-goerli.g.alchemy.com/v2/M3uND7od01QVjQN9Px8TCxnMcPRgWTCH",
    maxCostMultiplier: 120,
    upgradeDelay: 10,
    guardianDelay: 10,
    guardianSalt: "",
    chainId: 421613,
    defaultMaxFee: "0.135",
    defaultMaxPriorityFee: "0",
    chainIdHex: `0x${(421613).toString(16)}`,
    chainName: "Arbitrum",
    chainToken: "ETH",
    addressPrefix: "arb:",
    support1559: true,
    tokens: {
        usdc: erc20_USDC,
    },
    contracts: {
        l1Keystore: "0xa0126a11877f3edb06cf6afac809f92d324007dc",
        keyStoreModule: "0x39e5aefbcd9949d1f1d0657d380ead45c0a2367d",
        keyStoreModuleProxy: "0xd94849d394f4b3ed342a9e01de3157128c344fd0",
        soulWalletFactory: "0xa460c9695552d09ff6d9c93b2ea87fc606dc9900",
        defaultCallbackHandler: "0x2de0f1b7d3fbe2a86b88446acdbc294c91aa8f97",
        securityControlModule: "0xe9793d7792d3d736ecde0cc89050232704ad323e",
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        paymaster: "0x357c443022df521e3d6d9c5ec88c0f03fcec0cd1",
    },
};


