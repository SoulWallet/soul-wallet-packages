import React, { useState } from "react";
import { Modal, ModalOverlay, ModalContent, Text, Flex, Box, Image } from "@chakra-ui/react";
import IconError from "@src/assets/icons/error.svg";

export default function ErrorModal({ text, onClose, okText, cancelText, onOk, onCancel }: any) {
    return (
        <Modal isOpen={true} onClose={onClose} isCentered>
            <ModalOverlay backdropFilter={"blur(7.5px)"} bg="rgba(137, 137, 137, 0.20)" />
            <ModalContent
                mx="20px"
                p="5"
                textAlign={"center"}
                bg="#fff"
                rounded="20px"
                boxShadow={"0px 4px 4px 0px rgba(0, 0, 0, 0.25)"}
                flexDir={"column"}
                gap="5"
            >
                <Box>
                    <Image src={IconError} w="58px" h="58px" mx="auto" display={"block"} />
                    <Text color="#1e1e1e" fontWeight={"800"} fontSize="18px">
                        {text}
                    </Text>
                </Box>

                <Flex align={"center"}>
                    <Text
                        w="50%"
                        cursor={"pointer"}
                        onClick={onCancel}
                        fontSize={"16px"}
                        fontWeight={"800"}
                        color="brand.red"
                    >
                        {cancelText}
                    </Text>
                    <Text
                        w="50%"
                        cursor={"pointer"}
                        py="3"
                        fontSize={"16px"}
                        fontWeight={"800"}
                        bg="brand.red"
                        _hover={{
                            bg: "brand.redDarken",
                        }}
                        color="#fff"
                        rounded="20px"
                        onClick={onOk}
                    >
                        {okText}
                    </Text>
                </Flex>
            </ModalContent>
        </Modal>
    );
}
