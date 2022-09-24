// todo, chain should be direved from .env
import envConf from "./ropsten";

export default {
    walletName: "Soul Wallet",
    safeCenterURL: "https://google.com",
    backendURL: "https://securecenter-poc.soulwallets.me",
    ...envConf,
};
