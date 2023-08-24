import React from "react";
import { Box, Text, Input, Flex } from "@chakra-ui/react";

export function AddressInput({ label, placeholder, value, memo, onChange, disabled, onEnter }: any) {
    const onKeyDown = (e: any) => {
        const { keyCode } = e;
        if (keyCode === 13 && onEnter) {
            onEnter();
        }
    };

    return (
        <Box>
            <Text fontFamily={"Martian"} fontSize="12px" fontWeight={"500"} mb="1" px="4">
                {label}
            </Text>
            <Flex gap="2" align="center" justify={"flex-start"} rounded="20px" bg="#fff" py="3" px="4">
                <Input
                    value={value}
                    spellCheck={false}
                    placeholder={placeholder}
                    onChange={onChange}
                    variant={"unstyled"}
                    _disabled={{ opacity: "1", cursor: "not-allowed" }}
                    _placeholder={{ fontWeight: "600" }}
                    fontWeight={"800"}
                    color="#1e1e1e"
                    disabled={disabled}
                    onKeyDown={onKeyDown}
                    w={memo ? "unset" : "100%"}
                />
                {memo && (
                    <Text fontSize={"12px"} fontWeight={"600"} color="#898989">
                        {memo}
                    </Text>
                )}
            </Flex>
        </Box>
    );
}

export function AddressInputReadonly({ label, value, memo, onEnter }: any) {
    return (
        <Box>
            <Text fontFamily={"Martian"} fontSize="12px" fontWeight={"500"} mb="1" px="4">
                {label}
            </Text>
            <Flex gap="2" align="center" justify={"flex-start"} rounded="20px" bg="#fff" py="3" px="4">
                <Text fontWeight={"800"}>{value}</Text>
                {memo && (
                    <Text fontSize={"12px"} fontWeight={"600"} color="#898989">
                        {memo}
                    </Text>
                )}
            </Flex>
        </Box>
    );
}
