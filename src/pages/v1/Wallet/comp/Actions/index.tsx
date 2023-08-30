import React from "react";
import { Text, Grid, GridItem, Image, Tooltip, useToast } from "@chakra-ui/react";
import useBrowser from "@src/hooks/useBrowser";
import IconAddFunds from "@src/assets/actions/add-funds.svg";
import IconSend from "@src/assets/actions/send.svg";
import IconGuardians from "@src/assets/actions/guardians.svg";
import Icon2FA from "@src/assets/actions/2fa.svg";
import { ethers } from "ethers";

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

export default function Actions({ showSetGuardian }: any) {
    const { navigate, goWebsite } = useBrowser();
    const toast = useToast();
    return (
        <>
            <Grid templateColumns={"repeat(2, 1fr)"} gap="1" mt="4">
                <ActionItem title="Add funds" icon={IconAddFunds} onClick={() => navigate(`add-fund`)} />
                <ActionItem
                    title="Send tokens"
                    icon={IconSend}
                    onClick={() => navigate(`send/${ethers.ZeroAddress}`)}
                />
                {!showSetGuardian && (
                    <>
                        <ActionItem
                            title="Guardians"
                            icon={IconGuardians}
                            onClick={() => goWebsite(`edit-guardians`)}
                        />
                        <ActionItem
                            title="Authenticate"
                            icon={Icon2FA}
                            onClick={() => toast({ title: "Coming soon", status: "info" })}
                        />
                    </>
                )}
            </Grid>
        </>
    );
}
