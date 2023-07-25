import React, { useState, useEffect } from "react";
import config from "@src/config";
import { Grid, Flex, GridItem, Image } from "@chakra-ui/react";
import NftImg0 from "@src/assets/mock/nft-0.png";
import NftImg1 from "@src/assets/mock/nft-1.png";

interface INftItem {
    tokenImg: string;
}

const mockData = [
    {
        tokenImg: NftImg0,
    },
    {
        tokenImg: NftImg1,
    },
];

export default function Nfts() {
    const [nftBalance, setNftBalance] = useState<INftItem[]>([]);

    const getNftBalance = async () => {
        setNftBalance(mockData);
    };

    useEffect(() => {
        getNftBalance();
    }, []);

    return (
        <Grid templateColumns={"repeat(2, 1fr)"} gap="3">
            {nftBalance.map((item: INftItem) => (
                <GridItem>
                    <Image src={item.tokenImg} rounded={"20px"} />
                </GridItem>
            ))}
        </Grid>
    );
}
