/**
 * Guardian
 */

import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import { EIP4337Lib } from "soul-wallet-lib";
import useTools from "./useTools";
import {
    getLocalStorage,
    removeLocalStorage,
    setLocalStorage,
} from "@src/lib/tools";
import useQuery from "./useQuery";
import { guardianList } from "@src/config/mock";
import { Json } from "json-rpc-engine";
import { each, range } from "lodash";

export default function useGuardian() {
    const { walletAddress, executeOperation, ethersProvider } =
        useWalletContext();
    const { getGasPrice } = useQuery();
    const { getGuardianInitCode } = useTools();

    const updateGuardian = async (guardianAddress: string) => {
        const actionName = "Add Guardian";
        const currentFee = await getGasPrice();
        const nonce = await EIP4337Lib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );

        const guardianInitCode = getGuardianInitCode(guardianList);
        // TODO, need new guardianInitCode here
        const setGuardianOp = await EIP4337Lib.Guardian.setGuardian(
            ethersProvider,
            walletAddress,
            guardianInitCode.address,
            nonce,
            config.contracts.entryPoint,
            config.contracts.paymaster,
            currentFee,
            currentFee,
        );
        if (!setGuardianOp) {
            throw new Error("setGuardianOp is null");
        }

        await executeOperation(setGuardianOp, actionName); // do not need different actions?
    };

    const loadLocalGuardian = async () => {
        const localGuardianConfig =
            (await getLocalStorage("localGuardianConfig-" + walletAddress)) ||
            {};
        console.log(loadLocalGuardian);
        return JSON.parse(localGuardianConfig); //push? delete?
    };
    // const loadFileGuardian = async (guardianListObjArray: Json) => {
    //     const localGuardianConfig = null;
    //     // todo coding
    //     return localGuardianConfig;
    // };

    const _checkGuardianConfig = async (guardianListObjArray: Array<Json>) => {
        // const localGuardianConfig = getLocalStorage("localGuardianConfig");
        guardianListObjArray.forEach(element => {
            if (!checkAddress(element["wallet_address"])) {
                return false;
            }
        });
        return true;
    };
    const saveLocalGuardian = async (guardianListObjArray: Array<Json>) => {
        // const localGuardianConfig = JSON.stringify(jsonObj);
        _checkGuardianConfig(guardianListObjArray);
        const guardianListStringArray = JSON.stringify(guardianListObjArray);
        await removeLocalStorage("localGuardianConfig-" + walletAddress); // to be discuss
        await setLocalStorage("localGuardianConfig-", guardianListStringArray);
        return true;
    };

    return {
        updateGuardian,
        saveLocalGuardian,
    };
}
