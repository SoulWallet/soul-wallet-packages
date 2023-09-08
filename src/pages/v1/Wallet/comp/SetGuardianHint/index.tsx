import React from "react";
import { Box, Text, Flex } from "@chakra-ui/react";
import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";

export default function SetGuardianHint({ onSkip }: any) {
    const { goWebsite } = useBrowser();
    const doSkip = () => {
        localStorage.setItem("skipSet", "true");
        onSkip();
    };
    return (
        <Box bg="#fff" rounded="20px" p="4" pb="3" color="#000" mt="1" textAlign={"center"}>
            <Text fontWeight={"800"} fontSize={"18px"}>
                Set up guardians
            </Text>
            <Text fontSize="14px" fontWeight={"600"}>
                To secure future social recovery of your wallet. Set up your guardians now.
            </Text>
            <Flex gap="2" justify="center" mt="1">
                <Button
                    fontSize="14px"
                    fontWeight={"800"}
                    py="2"
                    color="#898989"
                    bg="#fff"
                    border="1px solid #898989"
                    _hover={{ bg: "#898989", color: "#fff" }}
                    onClick={doSkip}
                >
                    Skip
                </Button>
                <Button fontSize="14px" fontWeight={"800"} py="2" onClick={() => goWebsite("edit-guardians")}>
                    Begin
                </Button>
            </Flex>
        </Box>
    );
}
