// TODO, chain should be direved from .env
import envConf from "./goerli";

export default {
    walletName: "Soul Wallet",
    socials: {
        telegram: "https://t.me/+XFUHusXFdTYyODQ9",
    },
    safeCenterURL: "https://www.soulwallets.me/security-center",
    zeroAddress: "0x0000000000000000000000000000000000000000",
    //todo, move to .env
    ...envConf,
};
