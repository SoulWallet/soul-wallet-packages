import React, { useEffect } from "react";
import { Box, Flex, Text, Image } from "@chakra-ui/react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useQuery from "@src/hooks/useQuery";
import BN from "bignumber.js";
import { useBalanceStore } from "@src/store/balanceStore";
import { ITokenItem } from "@src/lib/type";
import ListItem from "../ListItem";
import config from "@src/config";

export default function Tokens() {
    const { walletAddress } = useWalletContext();
    const { balance } = useBalanceStore();
    const { getBalances } = useQuery();

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        getBalances();
    }, [walletAddress]);

    return (
        <Box color="#1e1e1e" fontSize={"14px"} lineHeight={"1"}>
            {config.assetsList.map((item: ITokenItem, idx: number) => (
                <ListItem
                    key={idx}
                    idx={idx}
                    icon={item.icon}
                    title={item.name}
                    titleDesc={"Token"}
                    amount={`${BN(balance.get(item.address) || 0).toPrecision(4)} ${item.symbol}`}
                    amountDesc={`$1231.21`}
                />
            ))}
        </Box>
    );
}
