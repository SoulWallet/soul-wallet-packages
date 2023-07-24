import React from "react";
import config from "@src/config";
import { Box, Text, Flex, Grid, GridItem, Image } from "@chakra-ui/react";
import IconAddFunds from "@src/assets/actions/add-funds.svg";
import IconSend from "@src/assets/actions/send.svg";
import IconGuardians from "@src/assets/actions/guardians.svg";
import IconGasTokens from "@src/assets/actions/gas-tokens.svg";
import Icon2FA from "@src/assets/actions/2fa.svg";
import IconMore from "@src/assets/actions/more.svg";

const ActionItem = ({ icon, title }: any) => {
    return (
        <GridItem p="10px" bg="white" rounded={"16px"} cursor={"pointer"}>
            <Image src={icon} w="28px" h="28px" />
            <Text fontWeight={"700"} fontSize="14px">
                {title}
            </Text>
        </GridItem>
    );
};

export default function Actions() {
    return (
        <Grid templateColumns={"repeat(3, 1fr)"} gap="1" mt="16px" mb="24px">
            <ActionItem title="Add funds" icon={IconAddFunds} />
            <ActionItem title="Send" icon={IconSend} />
            <ActionItem title="Guardians" icon={IconGuardians} />
            <ActionItem title="Gas tokens" icon={IconGasTokens} />
            <ActionItem title="2FA" icon={Icon2FA} />
            <ActionItem title="More" icon={IconMore} />

            {/* <div className="px-6  grid grid-cols-2 items-center gap-6">
                <label htmlFor={receiveModalId}>
                    <Button title="Receive" icon={IconReceive} iconLight={IconReceiveLight} />
                </label>
                <Button
                    title="Send"
                    icon={IconSend}
                    iconLight={IconSendLight}
                    onClick={() => navigate(`send/${config.zeroAddress}`)}
                />
            </div>
            <ReceiveModal modalId={receiveModalId} /> */}
        </Grid>
    );
}
