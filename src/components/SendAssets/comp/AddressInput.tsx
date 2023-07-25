import React from "react";
import { Box, Text, Flex, Menu, MenuButton, MenuList, MenuItem, Image, Input, Button } from "@chakra-ui/react";

export default function AddressInput({ label, address, onChange, disabled }: any) {
    return (
        <Box>
            <Text fontFamily={"Martian"} fontSize="12px" fontWeight={"500"} mb="1" px="4">
                {label}
            </Text>
            <Box rounded="20px" bg="#fff" py="3" px="4">
                <Input
                    value={address}
                    spellCheck={false}
                    onChange={onChange}
                    variant={"unstyled"}
                    _disabled={{ opacity: "1", cursor: "not-allowed" }}
                    fontWeight={"800"}
                    color="#1e1e1e"
                    disabled={disabled}
                />
            </Box>
        </Box>
    );
}
