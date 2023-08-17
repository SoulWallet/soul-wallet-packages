import React, { useEffect, useState } from "react";
import Switch from "../Switch";
import { Box, Text, Flex, Image, Tooltip } from "@chakra-ui/react";
import IconConnected from "@src/assets/icons/connected.svg";
import { useSettingStore } from "@src/store/setting";
import { checkShouldInject } from "@src/lib/tools";

export default function Footer() {
    // IMPORTANT TODO, get from website
    const origin = "app.uniswap.org";
    const [shouldInject, setShouldInject] = useState(false);
    const { globalShouldInject, shouldInjectList, shouldNotInjectList, addShouldInject, removeShouldInject } =
        useSettingStore();

    const onChange = async (checked: boolean) => {
        setShouldInject(checked);
        if (checked) {
            addShouldInject(origin);
        } else {
            removeShouldInject(origin);
        }
    };

    const checkShouldInject = async () => {
        let flag = true;
        if (shouldInjectList.includes(origin)) {
            flag = true;
        } else if (shouldNotInjectList.includes(origin)) {
            flag = false;
        } else if (globalShouldInject) {
            flag = true;
        } else if (!globalShouldInject) {
            flag = false;
        }
        setShouldInject(flag);
    };

    useEffect(() => {
        if(!origin){
            return
        }
        checkShouldInject();
    }, [origin]);

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
                    {origin}
                </Text>
            </Flex>
            <Tooltip label="Set Soul Wallet as default wallet for this dapp.">
                <Box>
                    <Switch checked={shouldInject} onChange={onChange} />
                </Box>
            </Tooltip>
        </Flex>
    );
}
