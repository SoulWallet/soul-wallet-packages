/**
 * Guardian
 */

import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import useLib from "./useLib";
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
    const { soulWalletLib } = useLib();

    const { walletAddress, executeOperation, ethersProvider } =
        useWalletContext();
    const { getGasPrice } = useQuery();
    const { getGuardianInitCode, verifyAddressFormat } = useTools();

    const updateGuardian = async (guardianAddress: string) => {
        const actionName = "Add Guardian";
        const currentFee = await getGasPrice();
        const nonce = await soulWalletLib.Utils.getNonce(
            walletAddress,
            ethersProvider,
        );

        const guardianInitCode = getGuardianInitCode(guardianList);
        // TODO, need new guardianInitCode here
        const setGuardianOp = await soulWalletLib.Guardian.setGuardian(
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

    type elementG = {
        id: string;
        name: string;
        wallet_address: string;
    };

    type guardianListObjArray = [elementG];

    const _checkGuardianConfig = async (guardArray: guardianListObjArray) => {
        // const localGuardianConfig = getLocalStorage("localGuardianConfig");

        guardArray.forEach((element) => {
            if (!verifyAddressFormat(element.wallet_address)) {
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
