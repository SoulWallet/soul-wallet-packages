// todo, chain should be direved from .env
import envConf from "./goerli";

export default {
    walletName: "Soul Wallet",
    safeCenterURL: "https://soul-wallet-www.vercel.app/security-center",
    backendURL: "https://securecenter-poc.soulwallets.me",
    zeroAddress: "0x0000000000000000000000000000000000000000",
    ...envConf,
};
