import React, { useState, useEffect } from "react";
import { useBalanceStore } from "@src/store/balanceStore";
import { Grid, GridItem, Image } from "@chakra-ui/react";
import { INftBalanceItem } from "@src/store/balanceStore";
import { useAddressStore } from "@src/store/address";

export default function Nfts() {
    const { selectedAddress } = useAddressStore();
    const { fetchNftBalance, nftBalance } = useBalanceStore();

    useEffect(() => {
        if (!selectedAddress) {
            return;
        }
        fetchNftBalance(selectedAddress);
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
