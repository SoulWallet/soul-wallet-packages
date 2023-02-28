/**
 * Transaction
 */

import useWalletContext from "../context/hooks/useWalletContext";
import useLib from "./useLib";
import useQuery from "./useQuery";
import BN from "bignumber.js";
import useKeystore from "./useKeystore";
import config from "@src/config";

export default function useTransaction() {
    const { executeOperation, walletAddress, ethersProvider } = useWalletContext();
    const { getGasPrice } = useQuery();
    const keyStore = useKeystore();
    const { soulWalletLib } = useLib();

    const signTransaction = async (txData: any) => {
        return await keyStore.sign(txData);
    };

    const sendEth = async (to: string, amount: string) => {
        const actionName = "Send ETH";
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);
        const op = await soulWalletLib.Tokens.ETH.transfer(
            ethersProvider,
            walletAddress,
            nonce,
            "0x",
            config.contracts.paymaster,
            maxFeePerGas,
            maxPriorityFeePerGas,
            to,
            amountInWei,
        );

        await executeOperation(op, actionName);
    };

    const sendErc20 = async (tokenAddress: string, to: string, amount: string) => {
        const actionName = "Send Assets";
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

        // get decimals `locally`
        const decimals = config.assetsList.filter((item: any) => item.address === tokenAddress)[0].decimals;
        const amountInWei = new BN(amount).shiftedBy(decimals).toString();
        const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);
        const op = await soulWalletLib.Tokens.ERC20.transfer(
            ethersProvider,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            "0x",
            maxFeePerGas,
            maxPriorityFeePerGas,
            tokenAddress,
            to,
            amountInWei,
        );

        if (!op) {
            return;
        }

        await executeOperation(op, actionName);
    };

    return {
        signTransaction,
        sendErc20,
        sendEth,
        executeOperation,
    };
}
