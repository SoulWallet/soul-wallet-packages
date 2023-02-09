/**
 * Transaction
 */

import useWalletContext from "../context/hooks/useWalletContext";
import { EIP4337Lib } from "soul-wallet-lib";
import BN from "bignumber.js";
import useQuery from "./useQuery";
import useKeystore from "./useKeystore";
import config from "@src/config";

export default function useTransaction() {
    const { executeOperation, walletAddress, ethersProvider } =
        useWalletContext();
    const { getGasPrice } = useQuery();
    const keyStore = useKeystore();

    const signTransaction = async (txData: any) => {
        return await keyStore.sign(txData);
    };

    const sendEth = async (to: string, amount: string) => {
        const actionName = "Send ETH";
        const currentFee = await getGasPrice();
        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const nonce = await EIP4337Lib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );
        const op = await EIP4337Lib.Tokens.ETH.transfer(
            ethersProvider,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            config.contracts.paymaster,
            currentFee,
            currentFee,
            to,
            amountInWei,
        );

        await executeOperation(op, actionName);
    };

    const sendErc20 = async (
        tokenAddress: string,
        to: string,
        amount: string,
    ) => {
        const actionName = "Send Assets";
        const currentFee = await getGasPrice();
        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const nonce = await EIP4337Lib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );
        const op = await EIP4337Lib.Tokens.ERC20.transfer(
            ethersProvider,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            config.contracts.paymaster,
            currentFee,
            currentFee,
            tokenAddress,
            to,
            amountInWei,
        );

        await executeOperation(op, actionName);
    };

    return {
        signTransaction,
        sendErc20,
        sendEth,
    };
}
