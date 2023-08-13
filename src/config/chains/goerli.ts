/**
 * Goerli
 */

import IconEth from "@src/assets/chains/eth.svg";

export default {
    icon: IconEth,
    recoverUrl: "http://soulwallet.io/recover",
    provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    scanUrl: "https://goerli.etherscan.io",
    bundlerUrl: "https://api-dev.soulwallet.io/bundler/eth-goerli/rpc",
    maxCostMultiplier: 110,
    chainId: 5,
    chainIdHex: (5).toString(16),
    defaultMaxFee: "1700000000",
    defaultMaxPriorityFee: "1500000000",
    chainName: "Goerli",
    chainToken: "ETH",
    addressPrefix: "gor:",
    fileName: 'goerli',
    support1559: true,
    paymasterTokens: [
        // test u
        "0x55dFb37E7409c4e2B114f8893E67D4Ff32783b35",
    ],
    contracts: {
        l1Keystore: "0x76a43ef7cc3b49736951759494d2aee8cae1cdec",
        keyStoreModuleProxy: "0x59b84bfaaa906a84152ded63d964cff913308921",
        soulWalletFactory: "0x576c13ccb03c21df9eeca0832719f0f6ffdc934b",
        defaultCallbackHandler: "0xb8466fa7777fbc8046fe92adab58736def8b4c8f",
        securityControlModule: "0x7a711e826b6383d6791cb43bfc0a4b72a2940183",
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        paymaster: "0xee4d0d07318dd076d588bccdf2383275b499f29f",
    },
};
