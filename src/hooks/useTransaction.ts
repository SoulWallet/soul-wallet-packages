/**
 * Transaction
 */

import useWalletContext from "../context/hooks/useWalletContext";
import useLib from "./useLib";
import useQuery from "./useQuery";
import BN from "bignumber.js";
import { ITokenItem } from "@src/lib/type";
import useKeyring from "./useKeyring";
import config from "@src/config";

export default function useTransaction() {
    const { executeOperation, walletAddress, ethersProvider } = useWalletContext();
    const { getGasPrice } = useQuery();
    const keyStore = useKeyring();
    const { soulWalletLib } = useLib();

    const signTransaction = async (txData: any) => {
        return await keyStore.sign(txData);
    };

    const sendEth = async (to: string, amount: string) => {
        const actionName = `Send ${config.chainToken}`;
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

        const amountInWei = new BN(amount).shiftedBy(18).toString();
        // const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);

        // const op = soulWalletLib.Tokens.ETH.transfer(
        //     walletAddress,
        //     nonce,
        //     "0x",
        //     maxFeePerGas,
        //     maxPriorityFeePerGas,
        //     to,
        //     amountInWei,
        // );

        // try {
        //     await executeOperation(op, actionName);
        // } catch (err) {
        //     console.warn(err);
        // }
    };

    const sendErc20 = async (tokenAddress: string, to: string, amount: string) => {
        const actionName = "Send Assets";
        const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

        // get decimals `locally`
        const decimals = config.assetsList.filter((item: ITokenItem) => item.address === tokenAddress)[0].decimals;
        const amountInWei = new BN(amount).shiftedBy(decimals).toString();
        // const nonce = await soulWalletLib.Utils.getNonce(walletAddress, ethersProvider);
        // const op = soulWalletLib.Tokens.ERC20.transfer(
        //     walletAddress,
        //     nonce,
        //     "0x",
        //     maxFeePerGas,
        //     maxPriorityFeePerGas,
        //     tokenAddress,
        //     to,
        //     amountInWei,
        // );

        // if (!op) {
        //     return;
        // }

        // try {
        //     await executeOperation(op, actionName);
        // } catch (err) {
        //     console.warn(err);
        // }
    };

    return {
        signTransaction,
        sendErc20,
        sendEth,
        executeOperation,
    };
}
