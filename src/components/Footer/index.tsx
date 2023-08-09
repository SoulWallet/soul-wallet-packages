import React, { useEffect, useState } from "react";
import Switch from "../Switch";
import { Box, Text, Flex, Image, Tooltip } from "@chakra-ui/react";
import { shallow } from "zustand/shallow";
import browser from "webextension-polyfill";
import IconConnected from "@src/assets/icons/connected.svg";
import { getLocalStorage } from "@src/lib/tools";
import { useSettingStore } from "@src/store/settingStore";
import config from "@src/config";
import InfoTip from "../InfoTip";

export default function Footer() {
    const [shouldInject, setShouldInject] = useState(false);

    const toggleDefaultProvider = async (val: boolean) => {
        await browser.storage.local.set({ shouldInject: val });
        setShouldInject(val);
    };

    const checkShouldInject = async () => {
        const res: any = await getLocalStorage("shouldInject");
        setShouldInject(res);
    };

    useEffect(() => {
        checkShouldInject();
    }, []);

    return (
        <Flex
            align="center"
            justify={"space-between"}
            bg="#d7d7d7"
            px="5"
            mt="20"
            borderTop={"1px"}
            py="10px"
            borderColor={"#898989"}
        >
            <Flex bg="#fff" rounded={"20px"} px="8px">
                <Image src={IconConnected} />
                <Text fontFamily={"Martian"} fontWeight={"500"} fontSize={"10px"}>
                    APP.UNISWAP.ORG
                </Text>
            </Flex>
            <Tooltip label="Set Soul Wallet as default wallet for this dapp.">
                <Box>
                    <Switch checked={shouldInject} onChange={toggleDefaultProvider} />
                </Box>
            </Tooltip>
        </Flex>
    );
}
