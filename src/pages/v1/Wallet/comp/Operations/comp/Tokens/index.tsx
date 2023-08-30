import React, { useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { ITokenBalanceItem, useBalanceStore } from "@src/store/balance";
import ListItem from "../ListItem";
import useConfig from "@src/hooks/useConfig";
import IconDefaultToken from "@src/assets/tokens/default.svg";
import useBrowser from "@src/hooks/useBrowser";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chain";

export default function Tokens() {
    const { selectedAddress } = useAddressStore();
    const { tokenBalance, fetchTokenBalance } = useBalanceStore();
    const { selectedChainItem } = useConfig();
    const { navigate } = useBrowser();

    useEffect(() => {
        const { chainIdHex, paymasterTokens } = selectedChainItem;

        if (!selectedAddress) {
            return;
        }
        fetchTokenBalance(selectedAddress, chainIdHex, paymasterTokens);
    }, [selectedAddress, selectedChainItem]);

    return (
        <Box color="#1e1e1e" fontSize={"14px"} lineHeight={"1"}>
            {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
                <ListItem
                    key={idx}
                    idx={idx}
                    icon={item.logoURI || IconDefaultToken}
                    title={item.name || "Unknown"}
                    titleDesc={"Token"}
                    amount={`${item.tokenBalanceFormatted} ${item.symbol}`}
                    amountDesc={``}
                    onClick={() => navigate(`send/${item.contractAddress}`)}
                />
            ))}
        </Box>
    );
}
