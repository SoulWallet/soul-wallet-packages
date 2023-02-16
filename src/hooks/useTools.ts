import config from "@src/config";
import useLib from "./useLib";
import { BigNumber } from "ethers";

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

    const getFeeCost = async (activateOp: any, tokenAddress?: string) => {
        // calculate eth cost
        const requiredPrefund = activateOp.requiredPrefund();
        console.log(
            "requiredPrefund: ",
            ethers.utils.formatEther(requiredPrefund),
            "ETH",
        );

        if (!tokenAddress) {
            return requiredPrefund;
        }

        // get USDC exchangeRate
        const exchangePrice = await soulWalletLib.getPaymasterExchangePrice(
            ethers.provider,
            config.contracts.paymaster,
            tokenAddress,
            true,
        );
        const tokenDecimals = exchangePrice.tokenDecimals || 6;
        // print price now
        console.log(
            "exchangePrice: " +
                ethers.utils.formatUnits(
                    exchangePrice.price,
                    exchangePrice.decimals,
                ),
            "USDC/ETH",
        );
        // get required USDC : (requiredPrefund/10^18) * (exchangePrice.price/10^exchangePrice.decimals)
        const requiredUSDC = requiredPrefund
            .mul(exchangePrice.price)
            .mul(BigNumber.from(10).pow(tokenDecimals))
            .div(BigNumber.from(10).pow(exchangePrice.decimals))
            .div(BigNumber.from(10).pow(18));
        console.log(
            "requiredUSDC: " +
                ethers.utils.formatUnits(requiredUSDC, tokenDecimals),
            "USDC",
        );

        return requiredUSDC;
    };

    return { getGuardianInitCode, verifyAddressFormat, getFeeCost };
}
