import IconETH from "@src/assets/tokens/eth.svg";
import IconWETH from "@src/assets/tokens/weth.png";

const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6"

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
    // bundlerUrl: "https://bundler-poc.soulwallets.me",
    bundlerUrl: "http://35.89.2.9:3000/rpc/",
    contracts: {
        logic: '0x0097e367385aD9215576019b4d311ca12c984049',
        entryPoint: "0x5C8b3e2232768d991Ea02ac8bEACaf824aEF0b7d",
        weth: wethAddress,
        paymaster: "0x6C8AC88860fA6CebFB44C598c3E2c55cEE08b734",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
