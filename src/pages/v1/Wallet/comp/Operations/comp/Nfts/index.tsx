import React, { useState, useEffect } from "react";
import { useBalanceStore } from "@src/store/balanceStore";
import { Grid, GridItem, Image } from "@chakra-ui/react";
import { INftBalanceItem } from "@src/store/balanceStore";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chain";

export default function Nfts() {
    const { selectedAddress } = useAddressStore();
    const { fetchNftBalance, nftBalance } = useBalanceStore();
    const { selectedChainId } = useChainStore();

    useEffect(() => {
        if (!selectedAddress) {
            return;
        }
        fetchNftBalance(selectedAddress, selectedChainId);
    }, [selectedAddress]);

    return (
        <Grid templateColumns={"repeat(2, 1fr)"} gap="3">
            {nftBalance.map((item: INftBalanceItem) => (
                <GridItem>
                    <Image rounded={"20px"} />
                </GridItem>
            ))}
        </Grid>
    );
}
