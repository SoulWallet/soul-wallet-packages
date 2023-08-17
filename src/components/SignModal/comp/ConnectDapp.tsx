import React from "react";
import { Box, Image, Flex, Text } from "@chakra-ui/react";
import IconLogo from "@src/assets/logo-v3.svg";
import IconLock from "@src/assets/icons/lock.svg";
import Button from "../../Button";
import useConfig from "@src/hooks/useConfig";
import { InfoWrap, InfoItem } from "../index";
import config from "@src/config";

enum SecurityLevel {
    High = "High",
    Medium = "Medium",
    Low = "Low",
}

const getSecurityColor = (level: SecurityLevel) => {
    switch (level) {
        case SecurityLevel.High:
            return "#1CD20F";
        case SecurityLevel.Medium:
            return "#DB9E00";
        case SecurityLevel.Low:
            return "#E83D26";
        default:
            return "#000";
    }
};

const DappAvatar = ({ avatar }: any) => (
    <Flex align="center" justify={"center"} bg="#fff" rounded="full" w="72px" h="72px">
        <Image src={avatar} w="44px" h="44px" />
    </Flex>
);

export default function ConnectDapp({ onConfirm, origin }: any) {
    const { selectedAddressItem } = useConfig();
    const { title, address } = selectedAddressItem;

    return (
        <Box pt="5">
            <Box textAlign={"center"}>
                <Flex
                    align="center"
                    display={"inline-flex"}
                    gap="3"
                    border={"dashed 2px"}
                    p="4"
                    borderColor={"#898989"}
                    rounded="100px"
                    mx="auto"
                    mb="5"
                    position={"relative"}
                >
                    <DappAvatar avatar={IconLogo} />
                    {/** TODO, get favicon here */}
                    <DappAvatar avatar={`${config.faviconUrl}${origin}`} />
                    <Image src={IconLock} position={"absolute"} left="0" right="0" bottom="-3" m="auto" />
                </Flex>
            </Box>

            <Box textAlign={"center"} mb="14px">
                <Text fontSize={"20px"} fontWeight={"800"} mb="1">
                    Connect to dapp
                </Text>
                <Text fontWeight={"600"}>{origin}</Text>
            </Box>
            <Box bg="#fff" rounded="20px" p="4" mb="6">
                <Text fontSize={"18px"} fontWeight={"800"} mb="1">
                    Allow
                </Text>
                <Box fontSize={"14px"} fontWeight={"600"}>
                    <Text mb="1">•&nbsp;&nbsp;View account address and transactions</Text>
                    <Text>•&nbsp;&nbsp;Suggest transactions</Text>
                </Box>
            </Box>
            <InfoWrap>
                <InfoItem>
                    <Text>Site security:</Text>
                    <Text color={getSecurityColor(SecurityLevel.High)}>{SecurityLevel.High}</Text>
                </InfoItem>
                <InfoItem>
                    <Text>{title}:</Text>
                    <Text>
                        {address.slice(0, 5)}...{address.slice(-4)}
                    </Text>
                </InfoItem>
            </InfoWrap>
            <Button w="100%" fontSize={"20px"} py="5" fontWeight={"800"} mt="6" onClick={onConfirm}>
                Connect
            </Button>
        </Box>
    );
}
