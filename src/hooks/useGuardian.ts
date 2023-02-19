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

    const loadLocalTempGuardian = async () => {
        const localGuardianConfig =
            (await getLocalStorage(
                "localTempGuardianConfig-" + walletAddress
            )) || {};
        console.log(loadLocalGuardian);
        return JSON.parse(localGuardianConfig); //push? delete?
    };

    // joi implement this function in plugin front page
    // const loadFileGuardian = async (guardianListObjArray: Json) => {
    //     const localGuardianConfig = null;
    //     // todo coding
    //     return localGuardianConfig;
    // };

    // it should be the formate of guardian list type, to be upgrade @todo
    type elementG = {
        id: string;
        name: string;
        wallet_address: string;
    };

    type guardianListObjArray = [elementG];

    const _checkGuardianConfig = async (guardArray: guardianListObjArray) => {
        // const localGuardianConfig = getLocalStorage("localGuardianConfig");
        // It will add more checking rules here @todo
        guardArray.forEach((element) => {
            if (!verifyAddressFormat(element.wallet_address)) {
                return {
                    result: false,
                    data: null,
                    msg: "Error in parsing the guardian config.",
                };
            }
        });
        return true;
    };

    // save final guardian config to local storage
    const saveLocalGuardian = async (guardArray: guardianListObjArray) => {
        // const localGuardianConfig = JSON.stringify(jsonObj);
        let checkResult = null;
        try {
            checkResult = _checkGuardianConfig(guardArray);
        } catch (error) {
            return checkResult;
        }
        const guardianListStringArray = JSON.stringify(guardArray);
        await removeLocalStorage("localGuardianConfig-" + walletAddress); // to be discuss
        await setLocalStorage("localGuardianConfig-", guardianListStringArray);
        return true;
    };

    // save temp guardian config to local storage
    const saveTempLocalGuardian = async (guardArray: guardianListObjArray) => {
        // const localGuardianConfig = JSON.stringify(jsonObj);
        let checkResult = null;
        try {
            checkResult = _checkGuardianConfig(guardArray);
        } catch (error) {
            return checkResult;
        }

        const guardianListStringArray = JSON.stringify(guardArray);
        await removeLocalStorage("localTempGuardianConfig-" + walletAddress); // to be discuss
        await setLocalStorage(
            "localTempGuardianConfig-",
            guardianListStringArray,
        );
        return true;
    };

    // save final guardian config to local storage
    const removeTempGuardian = async () => {
        await removeLocalStorage("localTempGuardianConfig-" + walletAddress); // to be discuss
        return true;
    };

    return {
        updateGuardian,
        saveLocalGuardian,
        saveTempLocalGuardian,
        loadLocalGuardian,
        loadLocalTempGuardian,
        removeTempGuardian,
    };
}
