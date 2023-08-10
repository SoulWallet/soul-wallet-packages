/**
 * Query data on chain
 */

import useWalletContext from "../context/hooks/useWalletContext";
import BN from "bignumber.js";
import { ethers } from "ethers";
import useTools from "./useTools";
import useSdk from "./useSdk";
import config from "@src/config";
import { addPaymasterAndData } from "@src/lib/tools";

export default function useQuery() {
    const { walletAddress, web3, ethersProvider } = useWalletContext();
    const { soulWallet } = useSdk();
    const { verifyAddressFormat } = useTools();

    const getEthBalance = async () => {
        const res = await web3.eth.getBalance(walletAddress);
        return new BN(res).shiftedBy(-18).toString();
    };

    const getEthPrice = async () => {
        // get price from coingecko
        const res = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd");
        console.log("res", await res.json());
    };

    const getBalances = async () => {
        if (!walletAddress) {
            return;
        }

        // const ethBalance = await getEthBalance();
        // setBalance(config.zeroAddress, ethBalance);
    };

    const getGasPrice = async () => {
        // if it's in the fixed price list, set fixed
        if (config.chainId === 421613 || config.chainId === 42161) {
            return {
                maxFeePerGas: `0x${ethers.parseUnits(config.defaultMaxFee, "gwei").toString(16)}`,
                maxPriorityFeePerGas: `0x${ethers.parseUnits(config.defaultMaxPriorityFee, "gwei").toString(16)}`,
            };
        }

        const feeData = await ethersProvider.getFeeData();
        if (config.support1559) {
            return {
                maxFeePerGas: `0x${feeData.maxFeePerGas?.toString(16)}`,
                maxPriorityFeePerGas: `0x${feeData.maxPriorityFeePerGas?.toString(16)}`,
            };
        } else {
            return {
                maxFeePerGas: `0x${feeData.gasPrice?.toString(16)}`,
                maxPriorityFeePerGas: `0x${feeData.gasPrice?.toString(16)}`,
            };
        }
    };

    const getFeeCost = async (userOp: any, payToken?: string) => {
        // set 1559 fee
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();
        userOp.maxFeePerGas = maxFeePerGas;
        userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

        if (payToken && payToken !== ethers.ZeroAddress) {
            userOp.paymasterAndData = addPaymasterAndData(payToken, config.contracts.paymaster);
        }

        // get gas limit
        const gasLimit = await soulWallet.estimateUserOperationGas(userOp);

        if (gasLimit.isErr()) {
            throw new Error(gasLimit.ERR.message);
        }

        // get preFund
        const preFund = await soulWallet.preFund(userOp);

        console.log("prefund", preFund);

        if (preFund.isErr()) {
            throw new Error(preFund.ERR.message);
        }

        // erc20
        if (payToken === ethers.ZeroAddress) {
            return {
                requiredAmount: BN(preFund.OK.missfund).shiftedBy(-18).toFixed(),
                userOp,
            };
        } else {
            // IMPORTANT TODO, get erc20 price
            getEthPrice();
            const erc20Price = 1853;

            return {
                requiredAmount: BN(preFund.OK.missfund)
                    .shiftedBy(-18)
                    .times(erc20Price)
                    .times(config.maxCostMultiplier)
                    .div(100)
                    .toFixed(),
                userOp,
            };
        }

        // // get required USDC : (requiredPrefund/10^18) * (exchangePrice.price/10^exchangePrice.decimals)
        // const requiredUSDC = requiredFinalPrefund
        //     .mul(exchangePrice.price)
        //     .mul(BigNumber.from(10).pow(tokenDecimals))
        //     .div(BigNumber.from(10).pow(exchangePrice.decimals))
        //     .div(BigNumber.from(10).pow(18));
        // console.log("requiredUSDC: " + ethers.formatUnits(requiredUSDC, tokenDecimals), "USDC");
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
