import useWalletContext from "@src/context/hooks/useWalletContext";
import Erc20Abi from "./abi/ERC20.json"
import BN from "bignumber.js";


export default function useErc20Contract() {
    const { web3, walletAddress } = useWalletContext();

    return {
        async getAllowance(tokenAddress: string, spenderAddress: string) {
            const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);

            return await tokenContract.methods
                .allowance(walletAddress, spenderAddress)
                .call();
        },

        async balanceOf(tokenAddress: string) {
            const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
            const res = await tokenContract.methods
                .balanceOf(walletAddress)
                .call();
            return new BN(res).shiftedBy(-18).toString();
        },
    };
}
