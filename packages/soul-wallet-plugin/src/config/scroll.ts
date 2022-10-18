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
    provider: "https://staging-prealpha.scroll.io/l2",
    defaultSalt: 0,
    feeMultiplier: 1.5,
    defaultTip: 10 * 10 ** 9,
    chainId: 5343541,
    scanUrl: "https://prealpha.scroll.io/l2scan",
    bundlerUrl: "https://bundler-poc-scroll.soulwallets.me",
    contracts: {
        entryPoint: "0x16c76A3526c5fC6888d30d77f7AFe17f21EBa1Da",
        weth: wethAddress,
        paymaster: "0x4e1655B667A2Edba56e3BBa21ED585B3D63B2a91",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
