/**
 * Transaction
 */

import useWalletContext from "../context/hooks/useWalletContext";
import useLib from "./useLib";
import useQuery from "./useQuery";
import { ethers } from "ethers";
import BN from "bignumber.js";
import { ITokenItem } from "@src/lib/type";
import useKeyring from "./useKeyring";
import config from "@src/config";
import Erc20ABI from "../contract/abi/ERC20.json";
import { useAddressStore } from "@src/store/address";
import { Transaction } from "@soulwallet/sdk";
import useBrowser from "./useBrowser";

export default function useTransaction() {
    const { executeOperation, walletAddress, ethersProvider } = useWalletContext();
    const { selectedAddress } = useAddressStore();
    const { getGasPrice } = useQuery();
    const keyStore = useKeyring();
    const { navigateToSign } = useBrowser();
    const { soulWalletLib } = useLib();

    const signTransaction = async (txData: any) => {
        return await keyStore.sign(txData);
    };

    const sendEth = async (to: string, amount: string) => {
        // const actionName = `Send ${config.chainToken}`;
        const amountInWei = new BN(amount).shiftedBy(18).toString();
        const tx: Transaction = {
            to,
            value: amountInWei,
            data: "0x",
        };

        navigateToSign({
            txns: [tx],
        });
    };

    const sendErc20 = async (tokenAddress: string, to: string, amount: string) => {
        // const actionName = "Send Assets";

        // get decimals `locally`
        const decimals = config.assetsList.filter((item: ITokenItem) => item.address === tokenAddress)[0].decimals;
        const amountInWei = new BN(amount).shiftedBy(decimals).toString();

        const erc20Interface = new ethers.Interface(Erc20ABI);
        const callData = erc20Interface.encodeFunctionData("transfer", [selectedAddress, to, amountInWei]);
        const tx: Transaction = {
            to: tokenAddress,
            value: amountInWei,
            data: callData,
        };

        navigateToSign({
            txns: [tx],
        });
    };

    return {
        signTransaction,
        sendErc20,
        sendEth,
        executeOperation,
    };
}
