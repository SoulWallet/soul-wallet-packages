import React, { useState } from "react";
import { Image, Flex, Text } from "@chakra-ui/react";
import ChainSelect from "../ChainSelect";
import useBrowser from "@src/hooks/useBrowser";
import IconChevronLeft from "@src/assets/icons/chevron-left.svg";
import IconGear from "@src/assets/icons/gear.svg";
import AccountSelect from "../AccountSelect";

interface INavbar {
    title?: string;
    backUrl?: string;
    onBack?: () => void;
}

export function Navbar({ backUrl, title, onBack }: INavbar) {
    const { navigate } = useBrowser();
    if (backUrl || onBack) {
        return (
            <>
                <Flex
                    display={"inline-flex"}
                    align="center"
                    position="relative"
                    zIndex={10}
                    onClick={() => (onBack ? onBack() : navigate(backUrl || "wallet"))}
                    mb="6"
                    cursor={"pointer"}
                >
                    <Image src={IconChevronLeft} w="20px" h="20px" />
                    <Text fontWeight="800" color="#1C1C1E">
                        Back
                    </Text>
                </Flex>
                {title && (
                    <Text fontWeight="800" position="absolute" left="0" right="0" top="6" m="auto" textAlign={"center"}>
                        {title}
                    </Text>
                )}
            </>
        );
    } else {
        return (
            <Flex align="center" justify={"space-between"} mb="4">
                <ChainSelect />
                <AccountSelect />
                <Image src={IconGear} w="32px" h="32px" cursor={"pointer"} onClick={() => navigate("setting")} />
            </Flex>
        );
    }
}
