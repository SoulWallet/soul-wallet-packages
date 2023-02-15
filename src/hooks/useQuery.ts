/**
 * Query data on chain
 */

import useWalletContext from "../context/hooks/useWalletContext";
import BN from "bignumber.js";
import useTools from "./useTools";
import config from "@src/config";

export default function useQuery() {
    const { executeOperation, walletAddress, web3 } = useWalletContext();
    const { verifyAddressFormat } = useTools();

    const getEthBalance = async () => {
        const res = await web3.eth.getBalance(walletAddress);
        return new BN(res).shiftedBy(-18).toString();
    };

    const getGasPrice = async () => {
        const gas = await web3.eth.getGasPrice();
        const gasMultiplied = new BN(gas)
            .times(config.feeMultiplier)
            .integerValue()
            .toNumber();
        console.log("gas multiplied", gasMultiplied);
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
        getEthBalance,
        getGasPrice,
        getWalletType,
    };
}
