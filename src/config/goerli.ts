import IconETH from "@src/assets/tokens/eth.svg";
import IconWETH from "@src/assets/tokens/weth.png";

export const wethAddress = "0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6";

export const infuraId = "36edb4e805524ba696b5b83b3e23ad18";

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
    infuraId,
    assetsList,
    provider: `https://goerli.infura.io/v3/${infuraId}`,
    // provider: "https://eth-mainnet.g.alchemy.com/v2/K9UhC2MV5uPm_j7WIRSWCrSJyaKg6Ggm",
    defaultSalt: 0,
    feeMultiplier: 3,
    defaultTip: 10 * 10 ** 9,
    // TODO,
    upgradeDelay: 10,
    guardianDelay: 100,
    guardianSalt: "",
    chainId: 5,
    scanUrl: "https://goerli.etherscan.io",
    // bundlerUrl: "https://bundler-poc.soulwallets.me",
    bundlerUrl: "http://35.89.2.9:3000/rpc/",
    contracts: {
        logic: "0x868BbfB49762bfe2a1cF2f104b99D5c792c03d9C",
        guardianLogic: "0xFeA560e88BfC3700A4d09F2bA337F4496D9a8ca5",
        entryPoint: "0x0f8425222890A6D2548e095102b4C0B9F4A08c82",
        weth: wethAddress,
        paymaster: "0x6C8AC88860fA6CebFB44C598c3E2c55cEE08b734",
        create2Factory: "0xce0042B868300000d44A59004Da54A005ffdcf9f",
    },
};
