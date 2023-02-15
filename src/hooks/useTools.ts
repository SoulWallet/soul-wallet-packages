import config from "@src/config";
import useLib from "./useLib";

export default function useTools() {
    const { soulWalletLib } = useLib();
    const getGuardianInitCode = (guardianList: any) => {
        return soulWalletLib.Guardian.calculateGuardianAndInitCode(
            config.contracts.guardianLogic,
            guardianList,
            Math.round(guardianList.length / 2),
            config.guardianSalt,
        );
    };

    const verifyAddressFormat = (address: string) => {
        return /^0x[0-9a-fA-F]{40}$/.test(address);
    };

    return { getGuardianInitCode, verifyAddressFormat };
}
