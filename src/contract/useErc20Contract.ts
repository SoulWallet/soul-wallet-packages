import useWalletContext from "@src/context/hooks/useWalletContext";
import Erc20Abi from "./abi/ERC20.json";
import BN from "bignumber.js";

export default function useErc20Contract() {
    const { web3, walletAddress, multicall } = useWalletContext();

    return {
        async getAllowance(tokenAddress: string, spenderAddress: string) {
            const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
            return await tokenContract.methods.allowance(walletAddress, spenderAddress).call();
        },

        async balanceOf(tokenAddress: string) {
            const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
            const res = await tokenContract.methods.balanceOf(walletAddress).call();
            const decimals = await tokenContract.methods.decimals().call();
            return new BN(res).shiftedBy(-decimals).toString();
        },

        async batchBalanceOf(tokenAddress: string[]) {
            const rawQuery = tokenAddress.map((address: string) => ({
                reference: address,
                contractAddress: address,
                abi: Erc20Abi,
                calls: [
                    { reference: "balanceOf", methodName: "balanceOf", methodParameters: [walletAddress] },
                    { reference: "decimals", methodName: "decimals" },
                ],
            }));

            return (await multicall.call(rawQuery)).results;
        },
    };
}
