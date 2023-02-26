/**
 * Query data on chain
 */

import useWalletContext from "../context/hooks/useWalletContext";
import BN from "bignumber.js";
import useTools from "./useTools";
import useErc20Contract from "@src/contract/useErc20Contract";
import { useBalanceStore } from "@src/store/balanceStore";
import config from "@src/config";

export default function useQuery() {
    const { walletAddress, web3 } = useWalletContext();
    const { setBalance } = useBalanceStore();
    const erc20Contract = useErc20Contract();

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
        const gas = await web3.eth.getGasPrice();
        const gasMultiplied = new BN(gas).times(config.feeMultiplier).integerValue().toNumber();
        return gasMultiplied;
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
        getWalletType,
    };
}
