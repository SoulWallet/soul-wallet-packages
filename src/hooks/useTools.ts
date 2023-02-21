import config from "@src/config";
import useLib from "./useLib";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { ethers, BigNumber } from "ethers";
import { GuardianItem } from "@src/lib/type";
import packageJson from "../../package.json";

export default function useTools() {
    const { ethersProvider } = useWalletContext();
    const { soulWalletLib } = useLib();

    const getGuardianInitCode = (guardiansList: string[]) => {
        return soulWalletLib.Guardian.calculateGuardianAndInitCode(
            config.contracts.guardianLogic,
            guardiansList,
            Math.round(guardiansList.length / 2),
            config.guardianSalt,
        );
    };

    const formatGuardianFile = (walletAddress: string, guardiansList: GuardianItem[] = []) => {
        return {
            walletVersion: packageJson.version,
            walletAddress: walletAddress,
            walletLogic: config.contracts.walletLogic,
            salt: "",
            chainId: config.chainId,
            endpointAddress: config.contracts.entryPoint,
            guardianList: guardiansList,
            guardianLogic: config.contracts.guardianLogic,
        };
    };

    const downloadJsonFile = async (jsonToSave: any) => {
        const dataStr = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(jsonToSave))}`;

        const link = document.createElement("a");

        link.setAttribute("href", dataStr);

        link.setAttribute("target", "_blank");

        link.setAttribute("download", "guardian.json");

        link.click();
    };

    const verifyAddressFormat = (address: string) => {
        return /^0x[0-9a-fA-F]{40}$/.test(address);
    };

    const getFeeCost = async (activateOp: any, tokenAddress?: string) => {
        // calculate eth cost
        const requiredPrefund = activateOp.requiredPrefund();
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

    const decodeCalldata = async (operation: any) => {
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

        const callDataDecode = await soulWalletLib.Utils.DecodeCallData.new().decode(operation.callData);
        console.log(`callDataDecode:`, callDataDecode);

        return callDataDecode;
    };

    return {
        getGuardianInitCode,
        verifyAddressFormat,
        getFeeCost,
        decodeCalldata,
        downloadJsonFile,
        formatGuardianFile,
    };
}
