export default {
    walletName: "Soul Wallet",
    faviconUrl: "https://www.google.com/s2/favicons?domain=",
    socials: {
        website: "https://www.soulwallet.io",
        telegram: "https://t.me/+XFUHusXFdTYyODQ9",
    },
    magicValue: "0x1626ba7e",
    zeroAddress: "0x0000000000000000000000000000000000000000",
    ...require(`./${process.env.CHAIN}`).default,
};
