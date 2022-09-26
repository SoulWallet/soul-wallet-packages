import IconETH from "@src/assets/tokens/eth.svg";
import IconWETH from "@src/assets/tokens/weth.png";
// import IconUSDC from "@src/assets/tokens/usdc.png";
// import IconUSDT from "@src/assets/tokens/usdt.png";

export const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        address: "0x0000000000000000000000000000000000000000",
    },
    {
        icon: IconWETH,
        symbol: "WETH",
        address: "0xec2a384Fa762C96140c817079768a1cfd0e908EA",
    },
];

export default {
    assetsList,
    provider: "https://ropsten.infura.io/v3/70d1f07f3ae54d9ab8d9b3bd6b8f5fe8",
    defaultSalt: 0,
    defaultTip: 4 * 10 ** 9,
    chainId: 3,
    contracts: {
        entryPoint: "0xbAecF6408a14C2bbBF62c87C554689E0FFC24C34",
        weth: "0xec2a384Fa762C96140c817079768a1cfd0e908EA",
        paymaster: "0xc299849c75a38fC9c91A7254d0F51A1a385EEb7a",
    },
};
