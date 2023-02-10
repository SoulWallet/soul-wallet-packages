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

    return { getGuardianInitCode };
}
