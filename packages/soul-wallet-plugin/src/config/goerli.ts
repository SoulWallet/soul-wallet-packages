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
        address: "0x2787015262404f11d7B6920C7eB46e25595e2Bf5",
    },
];

export default {
    assetsList,
    provider: "https://goerli.infura.io/v3/70d1f07f3ae54d9ab8d9b3bd6b8f5fe8",
    defaultSalt: 0,
    feeMultiplier: 3,
    defaultTip: 10 * 10 ** 9,
    chainId: 5,
    scanUrl: "https://goerli.etherscan.io",
    contracts: {
        entryPoint: "0x516638fcc2De106C325369187b86747fB29EbF32",
        weth: "0x2787015262404f11d7B6920C7eB46e25595e2Bf5",
        paymaster: "0x6cfE69b93B91dBfF4d2ea04fFd35dcc06490be4D",
    },
};
