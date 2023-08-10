import React, { useEffect } from "react";
import { Box, Image, Text } from "@chakra-ui/react";
import BN from "bignumber.js";
import { ITokenBalanceItem, useBalanceStore } from "@src/store/balanceStore";
import ListItem from "../ListItem";
import IconDefaultToken from '@src/assets/tokens/default.svg'
import IconLoading from "@src/assets/activity-loading.gif";
import useBrowser from "@src/hooks/useBrowser";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chain";

export default function Tokens() {
    const { selectedAddress } = useAddressStore();
    const { tokenBalance, fetchTokenBalance } = useBalanceStore();
    const { selectedChainId } = useChainStore();
    const { navigate } = useBrowser();

    useEffect(() => {
        if (!selectedAddress) {
            return;
        }
        console.log("Do fetch", selectedAddress, selectedChainId);
        // TODO, change chain id to config
        fetchTokenBalance(selectedAddress, selectedChainId);
    }, [selectedAddress]);

    return (
        <Box color="#1e1e1e" fontSize={"14px"} lineHeight={"1"}>
            {/** only for first time loading */}
            {(!tokenBalance || tokenBalance.length === 0) && <Image src={IconLoading} />}
            {tokenBalance.map((item: ITokenBalanceItem, idx: number) => (
                <ListItem
                    key={idx}
                    idx={idx}
                    icon={item.logoURI || IconDefaultToken}
                    title={item.name || 'Unknown'}
                    titleDesc={"Token"}
                    amount={`${BN(item.tokenBalance).shiftedBy(-item.decimals).toString()} ${item.symbol}`}
                    amountDesc={``}
                    onClick={() => navigate(`send/${item.contractAddress}`)}
                />
            ))}
        </Box>
    );
}
