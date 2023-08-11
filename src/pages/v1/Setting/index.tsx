import React, { useEffect, useState } from "react";
import { Image } from "@chakra-ui/react";
import packageJson from "../../../../package.json";
import IconLogo from "@src/assets/logo-v3.svg";
import IconSecurity from "@src/assets/icons/security.svg";
import IconDefault from "@src/assets/icons/default.svg";
import IconSupport from "@src/assets/icons/support.svg";
import IconChevronRight from "@src/assets/icons/chevron-right.svg";
import IconLockWallet from "@src/assets/icons/lock-wallet.svg";
import { Navbar } from "@src/components/Navbar";
import config from "@src/config";
import { Box, Text, Flex, Link } from "@chakra-ui/react";
import useKeyring from "@src/hooks/useKeyring";
import PageTitle from "@src/components/PageTitle";
import Switch from "@src/components/Switch";
import ResetPassword from "./comp/ResetPassword";
import useWalletContext from "@src/context/hooks/useWalletContext";

const SettingBox = ({ children, ...restProps }: any) => (
    <Flex
        align={"center"}
        bg="#fff"
        cursor={"pointer"}
        fontWeight={"800"}
        justify={"space-between"}
        py="10px"
        px="4"
        rounded="20px"
        {...restProps}
    >
        {children}
    </Flex>
);

const SettingLeft = ({ icon, title }: any) => (
    <Flex gap="1" align={"center"}>
        <Image src={icon} w="28px" h="28px" />
        <Text>{title}</Text>
    </Flex>
);

const SettingMainpage = ({ onChange }: any) => {
    const keyring = useKeyring();
    const { showLocked } = useWalletContext();

    const doLockWallet = async() => {
        await keyring.lock();
        showLocked();
    };

    return (
        <Box px="5" pt="6">
            <Navbar backUrl="wallet" />
            <PageTitle mb="6">Plugin settings</PageTitle>
            <Flex gap="2" flexDir={"column"}>
                <SettingBox onClick={() => onChange(1)}>
                    <SettingLeft icon={IconSecurity} title={"Login Password"} />
                    <Image src={IconChevronRight} w="6" h="6" />
                </SettingBox>
                <SettingBox>
                    <SettingLeft icon={IconDefault} title={"Set As Default"} />
                    <Switch checked={false} onChange={() => {}} />
                </SettingBox>
                <SettingBox onClick={doLockWallet}>
                    <SettingLeft icon={IconLockWallet} title={"Lock wallet"} />
                </SettingBox>
                <SettingBox>
                    <SettingLeft icon={IconSupport} title={"Support"} />
                    <Image src={IconChevronRight} w="6" h="6" />
                </SettingBox>
            </Flex>
            <Flex justify={"center"} align="center" gap="15px" mt="6" mb="3">
                {config.socials.map((item: any, idx: number) => (
                    <a href={item.link} key={idx} target="_blank">
                        <Image src={item.icon} h="20px" />
                    </a>
                ))}
            </Flex>

            <Flex justify={"center"} align="center" gap="2" fontWeight={"200"} fontSize={"12.5px"}>
                <Link isExternal fontWeight={"200"}>
                    Privacy Policy
                </Link>
                <Text>|</Text>
                <Link isExternal fontWeight={"200"}>
                    Terms Of Services
                </Link>
            </Flex>
            <Flex
                justify={"space-between"}
                align={"center"}
                w="100%"
                position={"absolute"}
                bottom={"3"}
                px="6"
                left="0"
                right="0"
            >
                <Image src={IconLogo} w="8" />
                <Text fontFamily={"Martian"} fontWeight={"300"} fontSize={"10px"}>
                    Version Beta {packageJson.version}
                </Text>
            </Flex>
        </Box>
    );
};

export default function Setting() {
    const [settingIndex, setSettingIndex] = useState(0);
    return (
        <>
            {!settingIndex && <SettingMainpage onChange={setSettingIndex} />}
            {settingIndex === 1 && <ResetPassword onCancel={() => setSettingIndex(0)} />}
        </>
    );
}
