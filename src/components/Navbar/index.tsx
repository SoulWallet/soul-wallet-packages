import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Image, Flex } from "@chakra-ui/react";
import Logo from "@src/assets/logo.svg";
import WalletSettingModal from "../WalletSettingModal";
import ChainSelect from "../ChainSelect";
import IconArrowBack from "@src/assets/arrow-left.svg";
import IconMenu from "@src/assets/menu.svg";
import IconGear from "@src/assets/icons/gear.svg";
import AccountSelect from "../AccountSelect";

interface IProps {
    backUrl?: string;
}

export function Navbar() {
    return (
        <Flex align="center" justify={"space-between"} mb="16px">
            <ChainSelect />

            <AccountSelect />

            <Image src={IconGear} w="32px" h="32px" cursor={"pointer"} />
        </Flex>
        // <div className="navbar flex items-center justify-between navbar-shadow">

        //     {/* {settingVisible && <WalletSettingModal onCancel={() => setSettingVisible(false)} />} */}
        // </div>
    );
}
