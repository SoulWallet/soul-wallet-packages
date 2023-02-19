import useWalletContext from "../context/hooks/useWalletContext";
import { guardianList } from "@src/config/mock";
import useKeystore from "./useKeystore";
import useTools from "./useTools";
import useLib from "./useLib";
import useQuery from "./useQuery";
import config from "@src/config";

export default function useWallet() {
    const { account, executeOperation, ethersProvider, walletAddress } =
        useWalletContext();
    const { getGasPrice } = useQuery();
    const { getGuardianInitCode, getFeeCost } = useTools();
    const keyStore = useKeystore();
    const { soulWalletLib } = useLib();

    const activateWalletETH = async () => {
        const actionName = "Activate Wallet";
        const currentFee = await getGasPrice();

        const guardianInitCode = getGuardianInitCode(guardianList);

        const activateOp = soulWalletLib.activateWalletOp(
            config.contracts.walletLogic,
            config.contracts.entryPoint,
            account,
            config.upgradeDelay,
            config.guardianDelay,
            guardianInitCode.address,
            config.zeroAddress,
            currentFee,
            currentFee,
        );

        await executeOperation(activateOp, actionName);
    };

    const activateWalletUSDC = async () => {
        const actionName = "Activate Wallet with USDC";
        const currentFee = await getGasPrice();

        const guardianInitCode = getGuardianInitCode(guardianList);

        const activateOp = soulWalletLib.activateWalletOp(
            config.contracts.walletLogic,
            config.contracts.entryPoint,
            account,
            config.upgradeDelay,
            config.guardianDelay,
            guardianInitCode.address,
            config.contracts.paymaster,
            currentFee,
            currentFee,
        );

        // need lib to export types
        const approveData: any = [
            {
                token: config.tokens.usdc,
                spender: config.contracts.paymaster,
            },
        ];
        const approveCallData =
            await soulWalletLib.Tokens.ERC20.getApproveCallData(
                ethersProvider,
                walletAddress,
                approveData,
            );
        activateOp.callData = approveCallData.callData;
        activateOp.callGasLimit = approveCallData.callGasLimit;

        await executeOperation(activateOp, actionName);
    };

    const calculateWalletAddress = (address: string) => {
        const guardianInitCode = getGuardianInitCode(guardianList);

        return soulWalletLib.calculateWalletAddress(
            config.contracts.walletLogic,
            config.contracts.entryPoint,
            address,
            config.upgradeDelay,
            config.guardianDelay,
            guardianInitCode.address,
        );
    };

    const getRecoverId = async (newOwner: string, walletAddress: string) => {
        let nonce = await soulWalletLib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );
        const currentFee = await getGasPrice();

        const recoveryOp = await soulWalletLib.Guardian.transferOwner(
            ethersProvider,
            walletAddress,
            nonce,
            config.contracts.entryPoint,
            config.contracts.paymaster,
            currentFee,
            currentFee,
            newOwner,
        );
        if (!recoveryOp) {
            throw new Error("recoveryOp is null");
        }

        const userOpHash = recoveryOp.getUserOpHash(
            config.contracts.entryPoint,
            config.chainId,
        );

        return { userOpHash, recoveryOp };
    };

    const recoverWallet = async (newOwner: string, signatures: string[]) => {
        const actionName = "Recover Wallet";

        const { userOpHash, recoveryOp }: any = await getRecoverId(
            newOwner,
            walletAddress,
        );

        // TODO, add guardian signatures here
        const signPack = "";

        recoveryOp.signature = signPack;

        await executeOperation(recoveryOp, actionName);
    };

    const deleteWallet = async () => {
        await keyStore.delete();
    };

    // The following functions is to be moved

    // const getWalletAddress = async () => {
    //     console.log("aaaaa");
    //     const cachedWalletAddress = await getLocalStorage(
    //         "activeWalletAddress",
    //     );
    //     if (cachedWalletAddress) {
    //         setWalletAddress(cachedWalletAddress);
    //     } else {
    //         const walletAddress: string = (
    //             await api.account.getWalletAddress({
    //                 key: account,
    //             })
    //         ).data.wallet_address;
    //         await setLocalStorage("activeWalletAddress", walletAddress);

    //         setWalletAddress(walletAddress);
    //     }
    // };

    // const getWalletAddressByEmail = async (email: string) => {
    //     const res: any = await api.account.getWalletAddress({
    //         email,
    //     });
    //     const walletAddress = res.data.wallet_address;
    //     return walletAddress;
    // };

    return {
        activateWalletETH,
        activateWalletUSDC,
        recoverWallet,
        calculateWalletAddress,
        deleteWallet,
        getRecoverId,
    };
}
