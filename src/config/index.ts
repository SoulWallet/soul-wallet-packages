import IconTwitter from "@src/assets/socials/twitter.svg";
import IconTelegram from "@src/assets/socials/telegram.svg";
import IconGithub from "@src/assets/socials/github.svg";

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
    chainList: [require(`./chains/arb-goerli`).default, require(`./chains/goerli`).default],
};
