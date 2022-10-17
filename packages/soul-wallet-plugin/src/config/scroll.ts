import IconETH from "@src/assets/tokens/eth.svg";
import IconWETH from "@src/assets/tokens/weth.png";

export const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
    },
    {
        icon: IconWETH,
        symbol: "WETH",
        address: "0x",
    },
];

export default {
    assetsList,
    provider: "https://scroll.infura.io/v3/10e7994fd33346e9b339dcde4b20c3c6",
    defaultSalt: 0,
    feeMultiplier: 3,
    defaultTip: 10 * 10 ** 9,
    chainId: 5,
    scanUrl: "https://goerli.etherscan.io",
    contracts: {
        entryPoint: "0x",
        weth: "0x",
        paymaster: "0x",
        create2Factory: "0xB68a9aA5c19f3024E1010F2864639793e2519cD8",
    },
};
