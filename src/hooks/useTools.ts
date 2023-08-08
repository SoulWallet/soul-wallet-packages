import api from "@src/lib/api";
import { ethers } from "ethers";
import QRCode from "qrcode";
import { GuardianItem } from "@src/lib/type";
import IconSend from "@src/assets/activities/send.svg";
import IconContract from "@src/assets/activities/contract.svg";
import { DecodeUserOp, DecodeResult } from "@soulwallet/decoder";
import { useToast } from "@chakra-ui/react";
import { UserOperation } from "@soulwallet/sdk";

interface IDecodedData extends Partial<DecodeResult> {
    functionName?: string;
}

export default function useTools() {
    const toast = useToast();
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
            toast({
                title: "Email sent.",
                status: "success",
            });
            return res;
        }
    };

    const verifyAddressFormat = (address: string) => {
        return /^0x[0-9a-fA-F]{40}$/.test(address);
    };

    const decodeCalldata = async (chainId: number, entrypoint: string, userOp: UserOperation) => {
        const decodeRet = await DecodeUserOp(chainId, entrypoint, userOp);
        if (decodeRet.isErr()) {
            console.error(decodeRet.ERR);
            return [];
        }

        const decoded:IDecodedData[] = decodeRet.OK;

        if(userOp.initCode !== '0x'){
            decoded.unshift({
                functionName: 'Create Wallet',
            })
        }

        for(let i of decoded){
            if(!i.method && i.value){
              i.functionName = 'Transfer ETH';
            }
        }

        return decoded;
    };

    const getIconMapping = (name: string) => {
        switch (name) {
            case "Transfer ERC20":
                return IconSend;
            case "Transfer ETH":
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
