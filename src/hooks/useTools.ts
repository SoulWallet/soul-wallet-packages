import config from "@src/config";
import useLib from "./useLib";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { ethers, BigNumber } from "ethers";
import api from "@src/lib/api";
import { GuardianItem } from "@src/lib/type";
import IconSend from "@src/assets/activities/send.svg";
import IconContract from "@src/assets/activities/Contract.svg";
import IconActivate from "@src/assets/activities/activate.svg";
import IconAdd from "@src/assets/activities/add.svg";

export default function useTools() {
    const { ethersProvider } = useWalletContext();
    const { soulWalletLib } = useLib();

    const getGuardianInitCode = (guardiansList: any) => {
        return soulWalletLib.Guardian.calculateGuardianAndInitCode(
            config.contracts.guardianLogic,
            guardiansList,
            Math.round(guardiansList.length / 2),
            config.guardianSalt,
        );
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
        await api.notification.backup({
            email,
            fileName: generateJsonName("guardian"),
            jsonToSave,
        });
    };

    const verifyAddressFormat = (address: string) => {
        return /^0x[0-9a-fA-F]{40}$/.test(address);
    };

    const getFeeCost = async (op: any, tokenAddress?: string) => {
        // calculate eth cost
        let baseFeeInGwei = "";
        if (config.support1559) {
            // TODO, move to store
            const fee: any = await soulWalletLib.Utils.suggestedGasFee.getEIP1559GasFees(config.chainId);

            baseFeeInGwei = ethers.utils.parseUnits(fee.estimatedBaseFee, "gwei").toString();
        }

        const requiredPrefund = op.requiredPrefund(baseFeeInGwei);
        console.log("requiredPrefund: ", ethers.utils.formatEther(requiredPrefund), "ETH");

        if (!tokenAddress) {
            return {
                requireAmountInWei: requiredPrefund,
                requireAmount: ethers.utils.formatEther(requiredPrefund),
            };
        }

        // get USDC exchangeRate
        const exchangePrice = await soulWalletLib.getPaymasterExchangePrice(
            ethersProvider,
            config.contracts.paymaster,
            tokenAddress,
            true,
        );
        const tokenDecimals = exchangePrice.tokenDecimals || 6;
        // print price now
        console.log(
            "exchangePrice: " + ethers.utils.formatUnits(exchangePrice.price, exchangePrice.decimals),
            "USDC/ETH",
        );
        // get required USDC : (requiredPrefund/10^18) * (exchangePrice.price/10^exchangePrice.decimals)
        const requiredUSDC = requiredPrefund
            .mul(exchangePrice.price)
            .mul(BigNumber.from(10).pow(tokenDecimals))
            .div(BigNumber.from(10).pow(exchangePrice.decimals))
            .div(BigNumber.from(10).pow(18));
        console.log("requiredUSDC: " + ethers.utils.formatUnits(requiredUSDC, tokenDecimals), "USDC");

        return {
            requireAmountInWei: requiredUSDC,
            requireAmount: ethers.utils.formatUnits(requiredUSDC, tokenDecimals),
        };
    };

    const decodeCalldata = async (callData: string) => {
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
        console.log(`callDataDecode:`, callDataDecode);

        return callDataDecode;
    };

    const getIconMapping = (name: string) => {
        switch (name) {
            case "transfer":
                return IconSend;
            case "activate":
                return IconActivate;
            case "Set Guardian":
                return IconAdd;
            default:
                return IconContract;
        }
    };

    return {
        getGuardianInitCode,
        verifyAddressFormat,
        getFeeCost,
        decodeCalldata,
        downloadJsonFile,
        emailJsonFile,
        formatGuardianFile,
        getIconMapping,
        getJsonFromFile,
    };
}
