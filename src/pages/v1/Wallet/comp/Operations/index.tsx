import React, { useState, useEffect } from "react";
import cn from "classnames";
import { Box, Flex, Text } from "@chakra-ui/react";
// import * as abi from "@soulwallet/abi";
import Tokens from "./comp/Tokens";
import Nfts from "./comp/Nfts";
import Activity from "./comp/Activity";

const tabs = ["Tokens", "NFTs", "Transactions"];

export default function Operations() {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    return (
        <>
            <Flex align="center" gap="4" mb="4">
                {tabs.map((item, index) => (
                    <Text
                        key={index}
                        cursor={"pointer"}
                        fontWeight={"800"}
                        lineHeight={"1"}
                        fontSize={"18px"}
                        color={activeTabIndex === index ? "brand.red" : "#898989"}
                        onClick={() => setActiveTabIndex(index)}
                    >
                        {item}
                    </Text>
                ))}
            </Flex>
            <Box>
                {activeTabIndex === 0 && <Tokens />}
                {activeTabIndex === 1 && <Nfts />}
                {activeTabIndex === 2 && <Activity />}
            </Box>
        </>
    );
}
