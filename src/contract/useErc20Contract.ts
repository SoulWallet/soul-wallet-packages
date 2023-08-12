export default function useErc20Contract() {
    return {
        async getAllowance(tokenAddress: string, spenderAddress: string) {
            // const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
            // return await tokenContract.methods.allowance(walletAddress, spenderAddress).call();
        },

        async balanceOf(tokenAddress: string) {
            // const tokenContract = new web3.eth.Contract(Erc20Abi, tokenAddress);
            // const res = await tokenContract.methods.balanceOf(walletAddress).call();
            // const decimals = await tokenContract.methods.decimals().call();
            // return new BN(res).shiftedBy(-decimals).toString();
        },
    };
}
