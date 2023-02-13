/**
 * Transaction
 */

import useWalletContext from "../context/hooks/useWalletContext";
import { EntryPointAbi } from "../abi";
import useLib from "./useLib";
import BN from "bignumber.js";
import ky from "ky";
import browser from "webextension-polyfill";
import useQuery from "./useQuery";
import useKeystore from "./useKeystore";
import config from "@src/config";
import { getLocalStorage, notify, setLocalStorage } from "@src/lib/tools";

export default function useTransaction() {
    const { executeOperation, walletAddress, ethersProvider } =
        useWalletContext();
    const { getGasPrice } = useQuery();
    const keyStore = useKeystore();
    const { soulWalletLib, bundler } = useLib();

    const signTransaction = async (txData: any) => {
        return await keyStore.sign(txData);
    };

    const sendEth = async (to: string, amount: string) => {
        const actionName = "Send ETH";
        const currentFee = await getGasPrice();
        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const nonce = await soulWalletLib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );
        const op = await soulWalletLib.Tokens.ETH.transfer(
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
        const nonce = await soulWalletLib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );
        const op = await soulWalletLib.Tokens.ERC20.transfer(
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

    const saveActivityHistory = async (history: any) => {
        let prev = (await getLocalStorage("activityHistory")) || [];
        prev.unshift(history);
        await setLocalStorage("activityHistory", prev);
    };

    return {
        signTransaction,
        sendErc20,
        sendEth,
        executeOperation,
        saveActivityHistory,
    };
}
