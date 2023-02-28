/**
 * Query data on chain
 */

import useWalletContext from "../context/hooks/useWalletContext";
import BN from "bignumber.js";
import { ethers, BigNumber } from "ethers";
import useTools from "./useTools";
import useLib from "./useLib";
import useErc20Contract from "@src/contract/useErc20Contract";
import { useBalanceStore } from "@src/store/balanceStore";
import config from "@src/config";

export default function useQuery() {
    const { walletAddress, web3, ethersProvider } = useWalletContext();
    const { setBalance } = useBalanceStore();
    const erc20Contract = useErc20Contract();
    const { soulWalletLib } = useLib();

    const { verifyAddressFormat } = useTools();

    const getEthBalance = async () => {
        const res = await web3.eth.getBalance(walletAddress);
        return new BN(res).shiftedBy(-18).toString();
    };

    const getBalances = async () => {
        // TODO, change to multicall
        if (!walletAddress) {
            return;
        }
        config.assetsList.forEach(async (item) => {
            let balanceNum: string = "0";
            if (item.symbol === "ETH") {
                balanceNum = await getEthBalance();
            } else {
                balanceNum = await erc20Contract.balanceOf(item.address);
            }

            setBalance(item.address, balanceNum);
        });
    };

    const getGasPrice = async () => {
        // const gas = await web3.eth.getGasPrice();
        // const gasMultiplied = new BN(gas).times(config.feeMultiplier).integerValue().toNumber();

        if (config.support1559) {
            const feeRaw = await ethersProvider.getFeeData();

            console.log("fee is", {
                baseFeePerGas: feeRaw.lastBaseFeePerGas?.toString() || "",
                maxFeePerGas: feeRaw.maxFeePerGas?.toString() || "",
                maxPriorityFeePerGas: feeRaw.maxPriorityFeePerGas?.toString() || "",
            });

            return {
                baseFeePerGas: feeRaw.lastBaseFeePerGas?.toString() || "",
                maxFeePerGas: feeRaw.maxFeePerGas?.toString() || "",
                maxPriorityFeePerGas: feeRaw.maxPriorityFeePerGas?.toString() || "",
            };
        } else {
            const feeRaw = await ethersProvider.getGasPrice();

            console.log("fee is", {
                baseFeePerGas: undefined,
                maxFeePerGas: feeRaw?.toString() || "",
                maxPriorityFeePerGas: feeRaw?.toString() || "",
            });
            return {
                baseFeePerGas: undefined,
                maxFeePerGas: feeRaw?.toString() || "",
                maxPriorityFeePerGas: feeRaw?.toString() || "",
            };
        }
        // return gasMultiplied;
    };

    const getFeeCost = async (op: any, tokenAddress?: string) => {
        const fee = await getGasPrice();
        const requiredPrefund = op.requiredPrefund(fee.baseFeePerGas).mul(120).div(100);
        console.log("requiredPrefund: ", ethers.utils.formatEther(requiredPrefund), "ETH");
        if (!tokenAddress) {
            return {
                requireAmountInWei: requiredPrefund,
                requireAmount: ethers.utils.formatEther(requiredPrefund),
            };
        }

        // get USDC exchangeRate
        const exchangePrice = await soulWalletLib.getPaymasterExchangePrice(
            ethersProvider,
            config.contracts.paymaster,
            tokenAddress,
            true,
        );
        const tokenDecimals = exchangePrice.tokenDecimals || 6;
        // print price now
        console.log(
            "exchangePrice: " + ethers.utils.formatUnits(exchangePrice.price, exchangePrice.decimals),
            "USDC/ETH",
        );
        // get required USDC : (requiredPrefund/10^18) * (exchangePrice.price/10^exchangePrice.decimals)
        const requiredUSDC = requiredPrefund
            .mul(exchangePrice.price)
            .mul(BigNumber.from(10).pow(tokenDecimals))
            .div(BigNumber.from(10).pow(exchangePrice.decimals))
            .div(BigNumber.from(10).pow(18));
        console.log("requiredUSDC: " + ethers.utils.formatUnits(requiredUSDC, tokenDecimals), "USDC");

        return {
            requireAmountInWei: requiredUSDC,
            requireAmount: ethers.utils.formatUnits(requiredUSDC, tokenDecimals),
        };
    };

    const getWalletType = async (address: string) => {
        if (!verifyAddressFormat(address)) {
            return "";
        }
        const contractCode = await web3.eth.getCode(address);
        return contractCode !== "0x" ? "contract" : "eoa";
    };

    return {
        getBalances,
        getEthBalance,
        getGasPrice,
        getFeeCost,
        getWalletType,
    };
}
