import React, { useState, useEffect } from "react";
import IconCopy from "@src/assets/copy.svg";
import useTools from "@src/hooks/useTools";
import { copyText } from "@src/lib/tools";
import { Flex, Text, Box, Image, useToast } from "@chakra-ui/react";

interface IReceiveCode {
    address: string;
    showFullAddress?: boolean;
    imgWidth?: string;
}

export default function ReceiveCode({ address, showFullAddress, imgWidth = "90px" }: IReceiveCode) {
    const [imgSrc, setImgSrc] = useState<string>("");
    const { generateQrCode } = useTools();
    const toast = useToast()

    const doCopy = () => {
        copyText(`${address}`);
        toast({
            title: "Copied",
            status: "success",
        })
    };

    const generateQR = async (text: string) => {
        try {
            setImgSrc(await generateQrCode(text));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!address) {
            return;
        }
        generateQR(address);
    }, [address]);

    return (
        <Box textAlign={"center"}>
            <Image src={imgSrc} mx="auto" display={"block"} w={imgWidth} />
            {showFullAddress ? (
                <Text fontFamily={"Martian"} mt="2" px="10" fontWeight={"600"} fontSize={"14px"}>
                    {address}
                </Text>
            ) : (
                <Flex align="center" gap="1" justify={"center"}>
                    <Text fontFamily={"Martian"} fontWeight={"600"} fontSize={"14px"}>
                        {address.slice(0, 6)}...{address.slice(-4)}
                    </Text>
                    <Image src={IconCopy} onClick={doCopy} w="20px" h="20px" cursor={"pointer"} />
                </Flex>
            )}
        </Box>
    );
}
