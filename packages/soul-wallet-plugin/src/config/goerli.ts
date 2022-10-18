import IconETH from "@src/assets/tokens/eth.svg";
import IconWETH from "@src/assets/tokens/weth.png";

const wethAddress = "0x2787015262404f11d7B6920C7eB46e25595e2Bf5"

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
    provider: "https://goerli.infura.io/v3/10e7994fd33346e9b339dcde4b20c3c6",
    defaultSalt: 0,
    feeMultiplier: 3,
    defaultTip: 10 * 10 ** 9,
    chainId: 5,
    scanUrl: "https://goerli.etherscan.io",
    bundlerUrl: "https://bundler-poc.soulwallets.me",
    contracts: {
        entryPoint: "0x516638fcc2De106C325369187b86747fB29EbF32",
        weth: wethAddress,
        paymaster: "0x6cfE69b93B91dBfF4d2ea04fFd35dcc06490be4D",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
