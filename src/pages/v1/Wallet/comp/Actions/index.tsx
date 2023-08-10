import React from "react";
import { Text, Grid, GridItem, Image } from "@chakra-ui/react";
import useBrowser from "@src/hooks/useBrowser";
import IconAddFunds from "@src/assets/actions/add-funds.svg";
import IconSend from "@src/assets/actions/send.svg";
import IconGuardians from "@src/assets/actions/guardians.svg";
// import IconGasTokens from "@src/assets/actions/gas-tokens.svg";
import Icon2FA from "@src/assets/actions/2fa.svg";
import config from "@src/config";

const ActionItem = ({ icon, title, onClick }: any) => {
    return (
        <GridItem
            p="10px"
            bg="white"
            _hover={{ bg: "#eee" }}
            display={"flex"}
            gap="1"
            alignItems={"center"}
            justifyContent={"center"}
            rounded={"16px"}
            cursor={"pointer"}
            onClick={onClick}
        >
            <Image src={icon} w="28px" h="28px" />
            <Text fontWeight={"700"} fontSize="14px">
                {title}
            </Text>
        </GridItem>
    );
};

export default function Actions() {
    const { navigate } = useBrowser();
    return (
        <>
            <Grid templateColumns={"repeat(2, 1fr)"} gap="1" mt="4" mb="6">
                <ActionItem title="Add funds" icon={IconAddFunds} onClick={() => navigate(`add-fund`)} />
                <ActionItem
                    title="Send tokens"
                    icon={IconSend}
                    onClick={() => navigate(`send/${config.zeroAddress}`)}
                />
                <ActionItem title="Guardians" icon={IconGuardians} />
                <ActionItem title="Authenticate" icon={Icon2FA} />
            </Grid>
            {/* <Grid templateColumns={"repeat(3, 1fr)"} gap="1" mt="1" mb="6">
               
            </Grid> */}
        </>
    );
}
