import React, { useEffect, useState } from "react";
import Switch from "../Switch";
import { Box, Text, Flex, Image, Tooltip } from "@chakra-ui/react";
import IconConnected from "@src/assets/icons/connected.svg";
import { useSettingStore } from "@src/store/setting";
import useBrowser from "@src/hooks/useBrowser";
import { checkShouldInject } from "@src/lib/tools";

export default function Footer() {
    const { getConnectedDapp } = useBrowser();
    const [origin, setOrigin] = useState<any>("");
    const [host, setHost] = useState("");
    const [isValidOrigin, setIsValidOrigin] = useState(false);

    const getOrigin = async () => {
        const connectedUrl = await getConnectedDapp();
        if (connectedUrl) {
            const url = new URL((await getConnectedDapp()) || "");
            setOrigin(url.origin);
            setHost(url.host);
            setIsValidOrigin(url.origin.startsWith("http"));
        } else {
            setIsValidOrigin(false);
        }
    };

    useEffect(() => {
        getOrigin();
    }, []);

    const [shouldInject, setShouldInject] = useState(false);
    const { addShouldInject, removeShouldInject } = useSettingStore();

    const onChange = async (checked: boolean) => {
        setShouldInject(checked);
        if (checked) {
            addShouldInject(origin);
        } else {
            removeShouldInject(origin);
        }
    };

    const check = () => {
        const should = checkShouldInject(origin);
        setShouldInject(should);
    };

    useEffect(() => {
        if (!origin) {
            return;
        }
        check();
    }, [origin]);

    if (!isValidOrigin) {
        return <></>;
    }

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
                {shouldInject && <Image src={IconConnected} />}
                <Text fontFamily={"Martian"} fontWeight={"500"} fontSize={"10px"}>
                    {host}
                </Text>
            </Flex>
            <Tooltip label={`Set Soul Wallet as default wallet for this dapp.`}>
                <Box>
                    <Switch checked={shouldInject} onChange={onChange} />
                </Box>
            </Tooltip>
        </Flex>
    );
}
