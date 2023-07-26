import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Flex, Text } from "@chakra-ui/react";
import Logo from "@src/assets/logo.svg";
import WalletSettingModal from "../WalletSettingModal";
import ChainSelect from "../ChainSelect";
import IconArrowBack from "@src/assets/arrow-left.svg";
import IconMenu from "@src/assets/menu.svg";
import useBrowser from "@src/hooks/useBrowser";
import IconChevronLeft from "@src/assets/icons/chevron-left.svg";
import IconGear from "@src/assets/icons/gear.svg";
import AccountSelect from "../AccountSelect";

interface INavbar {
    backUrl?: string;
    onBack?: () => void;
}

export function Navbar({ backUrl, onBack }: INavbar) {
    const { navigate } = useBrowser();
    console.log('on back is', onBack)
    if (backUrl || onBack) {
        return (
            <Flex
                display={"inline-flex"}
                align="center"
                onClick={() => (onBack ? onBack() : navigate(backUrl || 'wallet'))}
                mb="6"
                cursor={"pointer"}
            >
                <Image src={IconChevronLeft} w="20px" h="20px" />
                <Text fontWeight="800" color="#1C1C1E">
                    Back
                </Text>
            </Flex>
        );
    } else {
        return (
            <Flex align="center" justify={"space-between"} mb="4">
                <ChainSelect />
                <AccountSelect />
                <Image src={IconGear} w="32px" h="32px" cursor={"pointer"} onClick={() => navigate("setting")} />
            </Flex>
            // <div className="navbar flex items-center justify-between navbar-shadow">
            //     {/* {settingVisible && <WalletSettingModal onCancel={() => setSettingVisible(false)} />} */}
            // </div>
        );
    }
}
