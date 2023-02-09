import config from "@src/config";
import { EIP4337Lib } from "soul-wallet-lib";

export default function useTools() {
    const getGuardianInitCode = (guardianList: any) => {
        return EIP4337Lib.Guardian.calculateGuardianAndInitCode(
            config.contracts.guardianLogic,
            guardianList,
            Math.round(guardianList.length / 2),
            config.guardianSalt,
            config.contracts.create2Factory,
        );
    };

    return { getGuardianInitCode };
}
