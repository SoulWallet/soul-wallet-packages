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
    const { soulWalletLib, bundler } = useLib();

    const { verifyAddressFormat } = useTools();

    /**
     * Get token info by tokenAddress
     * @param tokenAddress
     */
    const getTokenByAddress = (tokenAddress: string) => {
        return config.assetsList.filter((item) => item.address === tokenAddress)[0];
    };

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

    const estimateUserOperationGas = async (userOp: any) => {
        // TODO, remove await bundler
        const b = await bundler;
        const estimateData: any = await b.eth_estimateUserOperationGas(userOp);
        console.log("call gas limit", userOp.callGasLimit);
        if (new BN(userOp.callGasLimit).isEqualTo(0)) {
            // IMPORTANT TODO, check if this works
            userOp.callGasLimit = estimateData.callGasLimit;
        }
        userOp.preVerificationGas = estimateData.preVerificationGas;
        userOp.verificationGasLimit = estimateData.verificationGas;
    };

    const getGasPrice = async () => {
        if (config.support1559) {
            // if it's arb goerli, set fixed
            if (config.chainId === 421613) {
                return {
                    baseFeePerGas: config.defaultBaseFee,
                    maxFeePerGas: config.defaultMaxFee,
                    maxPriorityFeePerGas: config.defaultMaxPriorityFee,
                };
            }
            const feeRaw = await ethersProvider.getFeeData();
            return {
                baseFeePerGas: feeRaw.lastBaseFeePerGas?.toString() || "",
                maxFeePerGas: feeRaw.maxFeePerGas?.toString() || "",
                maxPriorityFeePerGas: feeRaw.maxPriorityFeePerGas?.toString() || "",
            };
        } else {
            const feeRaw = await ethersProvider.getGasPrice();

            return {
                baseFeePerGas: undefined,
                maxFeePerGas: feeRaw?.toString() || "",
                maxPriorityFeePerGas: feeRaw?.toString() || "",
            };
        }
    };

    const getFeeCost = async (op: any, tokenAddress?: string) => {
        op.paymasterAndData = tokenAddress || "0x"

        await estimateUserOperationGas(op);

        const _requiredPrefund = await op.requiredPrefund(ethersProvider, config.contracts.entryPoint);

        const requiredPrefund = _requiredPrefund.requiredPrefund.sub(_requiredPrefund.deposit);

        const requiredFinalPrefund = requiredPrefund.gt(0) ? requiredPrefund : BigNumber.from(0);

        console.log("requiredPrefund: ", ethers.utils.formatEther(requiredFinalPrefund), "ETH");
        if (!tokenAddress) {
            return {
                requireAmountInWei: requiredFinalPrefund,
                requireAmount: ethers.utils.formatEther(requiredFinalPrefund),
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
        const requiredUSDC = requiredFinalPrefund
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
        getTokenByAddress,
        estimateUserOperationGas,
    };
}
