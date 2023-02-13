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
    const { getGuardianInitCode } = useTools();
    const keyStore = useKeystore();
    const { soulWalletLib } = useLib();

    const activateWalletETH = async () => {
        const actionName = "Activate Wallet";
        const currentFee = await getGasPrice();

        const guardianInitCode = getGuardianInitCode(guardianList);

        const activateOp = soulWalletLib.activateWalletOp(
            config.contracts.logic,
            config.contracts.entryPoint,
            account,
            config.upgradeDelay,
            config.guardianDelay,
            guardianInitCode.address,
            config.zeroAddress,
            currentFee,
            currentFee,
        );

        // const requiredPrefund = activateOp.requiredPrefund(ethers.utils.parseUnits(eip1559GasFee.estimatedBaseFee, "gwei"));
        const requiredPrefund = activateOp.requiredPrefund();

        console.log("requiredPrefund", requiredPrefund);

        await executeOperation(activateOp, actionName);
    };

    const activateWalletUSDC = async () => {};

    const calculateWalletAddress = (address: string) => {
        const guardianInitCode = getGuardianInitCode(guardianList);

        return soulWalletLib.calculateWalletAddress(
            config.contracts.logic,
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
        // get requestId
        const requestId = recoveryOp.getUserOpHash(
            config.contracts.entryPoint,
            config.chainId,
        );

        return { requestId, recoveryOp };
    };

    const recoverWallet = async (newOwner: string, signatures: string[]) => {
        const actionName = "Recover Wallet";

        const { requestId, recoveryOp }: any = await getRecoverId(
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
