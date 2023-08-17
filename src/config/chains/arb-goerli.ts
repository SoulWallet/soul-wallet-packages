/**
 * Arbitrum Goerli
 */

import IconArb from "@src/assets/chains/arb.svg";
import IconArbFaded from "@src/assets/chains/arb-faded.svg";

export default {
    icon: IconArb,
    iconFaded: IconArbFaded,
    cardBg: "radial-gradient(52.03% 100.00% at 100.00% 100.00%, #73DDFF 0%, #E2FC89 100%)",
    provider: `https://arbitrum-goerli.publicnode.com`,
    l1Provider: `https://goerli.infura.io/v3/36edb4e805524ba696b5b83b3e23ad18`,
    scanUrl: "https://testnet.arbiscan.io/",
    bundlerUrl: "https://api-dev.soulwallet.io/bundler/arb-goerli/rpc",
    maxCostMultiplier: 120,
    chainId: 421613,
    chainIdHex: `0x${(421613).toString(16)}`,
    defaultMaxFee: "0.135",
    defaultMaxPriorityFee: "0",
    chainName: "Arbitrum Goerli",
    chainToken: "ETH",
    addressPrefix: "arb:",
    fileName: "arb-goerli",
    support1559: true,
    paymasterTokens: [
        // test u
        "0xfd064A18f3BF249cf1f87FC203E90D8f650f2d63",
    ],
    contracts: {
        l1Keystore: "0x76a43ef7Cc3b49736951759494D2aeE8cae1cdec",
        keyStoreModuleProxy: "0x59b84bfaaa906a84152ded63d964cff913308921",
        soulWalletFactory: "0x576c13ccb03c21df9eeca0832719f0f6ffdc934b",
        defaultCallbackHandler: "0xb8466fa7777fbc8046fe92adab58736def8b4c8f",
        securityControlModule: "0x7a711e826b6383d6791cb43bfc0a4b72a2940183",
        entryPoint: "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789",
        paymaster: "0xee4d0d07318dd076d588bccdf2383275b499f29f",
    },
};
