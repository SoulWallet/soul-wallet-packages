import React, { useState, useEffect } from "react";
import EmptyHint from "../EmptyHint";
import { useBalanceStore } from "@src/store/balanceStore";
import { Grid, GridItem, Image } from "@chakra-ui/react";
import { INftBalanceItem } from "@src/store/balanceStore";
import { useAddressStore } from "@src/store/address";
import { useChainStore } from "@src/store/chainStore";

// used only for testing nft balance
const testWalletAddress = "0x120b4Ba4df837507B91dbd0A250eac28bE063b39";
const testChainId = 1;

export default function Nfts() {
    const { selectedAddress } = useAddressStore();
    const { fetchNftBalance, nftBalance } = useBalanceStore();
    const { selectedChainId } = useChainStore();

    useEffect(() => {
        if (!selectedAddress) {
            return;
        }
        fetchNftBalance(testWalletAddress, testChainId);
    }, [selectedAddress, selectedChainId]);

    return (
        <>
            {(!nftBalance || nftBalance.length === 0) && <EmptyHint title="You have no NFTs yet" />}
            <Grid templateColumns={"repeat(2, 1fr)"} gap="3">
                {nftBalance
                    .filter((item: any) => item.logoURI)
                    .map((item: any) => (
                        <GridItem>
                            <Image rounded={"20px"} src={item.logoURI} />
                        </GridItem>
                    ))}
            </Grid>
        </>
    );
}
