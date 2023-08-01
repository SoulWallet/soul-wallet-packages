import config from "@src/config";
import useLib from "./useLib";
import api from "@src/lib/api";
import { ethers } from "ethers";
import QRCode from "qrcode";
import { GuardianItem } from "@src/lib/type";
import IconSend from "@src/assets/activities/send.svg";
import IconContract from "@src/assets/activities/contract.svg";
import { toast } from "material-react-toastify";

export default function useTools() {
    const { soulWalletLib } = useLib();

    const getGuardianInitCode = (guardiansList: string[]) => {
        if (guardiansList.length === 0) {
            return {
                address: config.zeroAddress,
                initCode: "0x",
            };
        } else {
            return soulWalletLib.Guardian.calculateGuardianAndInitCode(
                config.contracts.guardianLogic,
                guardiansList,
                Math.ceil(guardiansList.length / 2),
                config.guardianSalt,
            );
        }
    };

    const formatGuardianFile = (walletAddress: string, guardiansList: GuardianItem[] = []) => {
        // remove id
        const guardians = guardiansList.map((item) => {
            return {
                address: item.address,
                name: item.name,
            };
        });
        return {
            walletAddress: walletAddress,
            guardians,
            // salt: "",
            // walletVersion: packageJson.version,
            // walletLogic: config.contracts.walletLogic,
            // chainId: config.chainId,
            // entrypointAddress: config.contracts.entryPoint,
            // guardianList: guardiansList,
            // threshold: Math.round(guardiansList.length / 2),
            // guardianLogic: config.contracts.guardianLogic,
            // upgradeDelay: config.upgradeDelay,
            // guardianDelay: config.guardianDelay,
        };
    };

    const generateJsonName = (name: string) => {
        const date = new Date();
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}-${name}.json`;
    };

    const downloadJsonFile = (jsonToSave: any) => {
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonToSave))}`;

        const link = document.createElement("a");

        link.setAttribute("href", dataStr);

        link.setAttribute("target", "_blank");

        link.setAttribute("download", generateJsonName("guardian"));

        link.click();
    };

    const getJsonFromFile = async (jsonFile: File) => {
        const reader = new FileReader();
        reader.readAsText(jsonFile);

        return new Promise((resolve) => {
            reader.onload = (e: any) => {
                const data = JSON.parse(e.target.result);
                resolve(data);
            };
        });
    };

    const emailJsonFile = async (jsonToSave: any, email: string) => {
        const res: any = await api.notification.backup({
            email,
            filename: generateJsonName("guardian"),
            backupObject: jsonToSave,
        });
        if (res.code === 200) {
            toast.success("Success");
            return res;
        }
    };

    const verifyAddressFormat = (address: string) => {
        return /^0x[0-9a-fA-F]{40}$/.test(address);
    };

    const decodeCalldata = async (callData: string) => {
        // TODO, add cache locally
        const tmpMap = new Map<string, string>();
        soulWalletLib.Utils.DecodeCallData.new().setStorage(
            (key, value) => {
                tmpMap.set(key, value);
            },
            (key) => {
                const v = tmpMap.get(key);
                if (typeof v === "string") {
                    return v;
                }
                return null;
            },
        );

        const callDataDecode = await soulWalletLib.Utils.DecodeCallData.new().decode(callData);

        return callDataDecode;
    };

    const getIconMapping = (name: string) => {
        switch (name) {
            case "transfer":
                return IconSend;
            default:
                return IconContract;
        }
    };

    const safeParseUnits = (val: string, digit: number) => {
        return ethers.parseUnits(val, digit);
    };

    const generateQrCode = async (text: string) => {
        return await QRCode.toDataURL(text, { margin: 2 });
    };

    return {
        safeParseUnits,
        getGuardianInitCode,
        verifyAddressFormat,
        decodeCalldata,
        downloadJsonFile,
        emailJsonFile,
        formatGuardianFile,
        getIconMapping,
        getJsonFromFile,
        generateQrCode,
    };
}
