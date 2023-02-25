// TODO, chain should be direved from .env
import envConf from "./goerli";

export default {
    walletName: "Soul Wallet",
    socials: {
        telegram: "https://t.me/+XFUHusXFdTYyODQ9",
    },
    zeroAddress: "0x0000000000000000000000000000000000000000",
    //todo, move to .env
    ...envConf,
};
