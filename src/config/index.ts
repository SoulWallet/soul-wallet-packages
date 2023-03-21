import Icon1inch from "@src/assets/dapps/1inch.svg";
import IconAave from "@src/assets/dapps/aave.svg";
import IconCurve from "@src/assets/dapps/curve.png";
import IconUniswap from "@src/assets/dapps/uniswap.svg";
import IconYearn from "@src/assets/dapps/yearn.svg";
// import envConf from './arb-goerli'

export const dappsList = [
    {
        icon: IconUniswap,
        title: "Uniswap",
        category: "DeFi",
        link: "https://uniswap.dapp.soulwallet.io",
    },
    // {
    //     icon: Icon1inch,
    //     title: "1inch",
    //     category: "DeFi",
    //     link: "https://app.1inch.io",
    // },
    // {
    //     icon: IconCurve,
    //     title: "Curve",
    //     category: "DeFi",
    //     link: "https://curve.fi",
    // },
    // {
    //     icon: IconYearn,
    //     title: "Yearn",
    //     category: "DeFi",
    //     link: "https://yearn.finance/",
    // },
    // {
    //     icon: IconAave,
    //     title: "Aave",
    //     category: "DeFi",
    //     link: "https://app.aave.com/",
    // },
];

export default {
    walletName: "Soul Wallet",
    socials: {
        website: "https://www.soulwallet.io",
        telegram: "https://t.me/+XFUHusXFdTYyODQ9",
    },
    dappsList,
    zeroAddress: "0x0000000000000000000000000000000000000000",
    ...require(`./${process.env.CHAIN}`).default,
};
