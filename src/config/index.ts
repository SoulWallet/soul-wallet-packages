import IconTwitter from "@src/assets/socials/twitter.svg";
import IconTelegram from "@src/assets/socials/telegram.svg";
import IconGithub from "@src/assets/socials/github.svg";
import IconEth from "@src/assets/chains/eth.svg";
import IconOp from "@src/assets/chains/op.svg";
import IconArb from "@src/assets/chains/arb.svg";

export const supportedChains = [
    {
        icon: IconEth,
        name: "Ethereum",
        chainId: 1,
    },
    {
        icon: IconOp,
        name: "Optimism",
        chainId: 10,
    },
    {
        icon: IconArb,
        name: "Arbitrum",
        chainId: 42161,
    },
];

export default {
    walletName: "Soul Wallet",
    faviconUrl: "https://www.google.com/s2/favicons?domain=",
    socials: [
        {
            icon: IconTwitter,
            link: "https://twitter.com/soulwallet_eth",
        },
        {
            icon: IconTelegram,
            link: "https://t.me/+XFUHusXFdTYyODQ9",
        },
        {
            icon: IconGithub,
            link: "https://github.com/proofofsoulprotocol",
        },
    ],
    magicValue: "0x1626ba7e",
    backendURL: "https://api-dev.soulwallet.io/appapi",
    soulScanURL: "https://api-dev.soulwallet.io/opapi",
    zeroAddress: "0x0000000000000000000000000000000000000000",
    pluginWebUrl: "",
    officialWebUrl: "http://localhost:8100/",
    ...require(`./${process.env.CHAIN}`).default,
};

export const chainIdMapping = {
  1: "ETH Mainnet",
  5: "Goerli",
  42: "KOVAN",
  56: "BSC Mainnet",
  128: "HECO Mainnet",
  97: "BSC Testnet",
  420: "Optimism Goerli Testnet",
  421613: "Arbitrum Goerli"
};

// Arbitrum: https://bundler-arb-main.soulwallets.me/rpc
// Goerli: https://bundler-eth-goerli.soulwallets.me/rpc
// Polygon: https://bundler-polygon-main.soulwallets.me/rpc
