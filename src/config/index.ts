// todo, chain should be direved from .env
import envConf from "./goerli";

export default {
    walletName: "Soul Wallet",
    safeCenterURL: "https://www.soulwallets.me/security-center",
    backendURL: "https://securecenter-poc.soulwallets.me",
    zeroAddress: "0x0000000000000000000000000000000000000000",
    //todo, move to .env
    ...envConf,
};
