/**
 * In-wallet Transactions
 */

import { ethers } from "ethers";
import BN from "bignumber.js";
import useKeyring from "./useKeyring";
import Erc20ABI from "../contract/abi/ERC20.json";
import { useAddressStore } from "@src/store/address";
import { Transaction } from "@soulwallet/sdk";
import useBrowser from "./useBrowser";

export default function useTransaction() {
    const { selectedAddress } = useAddressStore();
    const keyStore = useKeyring();
    const { navigateToSign } = useBrowser();

    const signTransaction = async (txData: any) => {
        return await keyStore.sign(txData);
    };

    const sendEth = async (to: string, amount: string) => {
        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const tx: Transaction = {
            to,
            value: amountInWei,
            data: "0x",
        };

        navigateToSign({
            txns: [tx],
            sendTo: to,
        });
    };

    const sendErc20 = async (tokenAddress: string, to: string, amount: string, decimals: number) => {
        const amountInWei = new BN(amount).shiftedBy(decimals).toString();
        const erc20Interface = new ethers.Interface(Erc20ABI);
        const callData = erc20Interface.encodeFunctionData("transfer", [to, amountInWei]);
        const tx: Transaction = {
            to: tokenAddress,
            data: callData,
        };

        navigateToSign({
            txns: [tx],
            sendTo: to,
        });
    };

    const setGuardian = () => {
    }

    return {
        signTransaction,
        sendErc20,
        sendEth,
    };
}
