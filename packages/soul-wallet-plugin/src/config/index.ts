// todo, chain should be direved from .env
import envConf from "./ropsten";
import IconETH from "@src/assets/tokens/eth.svg";
import IconUSDC from "@src/assets/tokens/usdc.png";
import IconUSDT from "@src/assets/tokens/usdt.png";

export const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        balance: "28.1937",
    },
    {
        icon: IconUSDC,
        symbol: "USDC",
        balance: "100.6913",
    },
    {
        icon: IconUSDT,
        symbol: "USDT",
        balance: "73.9712",
    },
];

export default {
    walletName: "Soul Wallet",
    safeCenterURL: "https://google.com",
    backendURL: "https://securecenter-poc.soulwallets.me",
    ...envConf,
};
