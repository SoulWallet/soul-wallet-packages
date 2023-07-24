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
        // <div className=" grid grid-cols-2 gap-y-2 gap-x-3 px-6 pt-3">
        //     {config.dappsList.map((item: any) => (
        //         <a
        //             target="_blank"
        //             href={item.link}
        //             key={item.title}
        //             className="dapp-item-shadow rounded-lg p-2 gap-2 flex items-center bg-white hover:bg-gray-100"
        //         >
        //             <img src={item.icon} className="w-10 h-10" />
        //             <div className="">
        //                 <div className="text-gray80 font-bold mb-[2px]">{item.title}</div>
        //                 <div className="text-gray60">{item.category}</div>
        //             </div>
        //         </a>
        //     ))}
        // </div>
    );
}
