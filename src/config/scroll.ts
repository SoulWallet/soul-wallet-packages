import IconETH from "@src/assets/tokens/eth.svg";
import IconWETH from "@src/assets/tokens/weth.png";

const wethAddress = '0x05fDbDfaE180345C6Cff5316c286727CF1a43327'

export const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
    },
    {
        icon: IconWETH,
        symbol: "WETH",
        address: wethAddress,
    },
];

export default {
    assetsList,
    provider: "https://prealpha.scroll.io/l2",
    defaultSalt: 0,
    feeMultiplier: 1.5,
    defaultTip: 10 * 10 ** 9,
    chainId: 534354,
    scanUrl: "https://l2scan.scroll.io",
    bundlerUrl: "https://bundler-poc-scroll.soulwallets.me",
    contracts: {
        entryPoint: "0x894b1680F9ac975A2191fDD7d0Efbd6732152ac8",
        weth: wethAddress,
        paymaster: "0x073e8b06529a516331af88CB648adAdd4025DD16",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
