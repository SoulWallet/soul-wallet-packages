import React, { useState, useEffect } from "react";
import cn from "classnames";
import config from "@src/config";
import { toast } from "material-react-toastify";
import IconCopy from "@src/assets/copy.svg";
import useTools from "@src/hooks/useTools";
import { copyText } from "@src/lib/tools";
import { Flex, Text, Box, Image } from "@chakra-ui/react";

interface IReceiveCode {
    walletAddress: string;
    showFullAddress?: boolean;
    imgWidth?: string;
}

export default function ReceiveCode({ walletAddress, showFullAddress, imgWidth = "90px" }: IReceiveCode) {
    const [imgSrc, setImgSrc] = useState<string>("");
    const { generateQrCode } = useTools();

    const doCopy = () => {
        copyText(`${config.addressPrefix}${walletAddress}`);
        toast.success("Copied");
    };

    const generateQR = async (text: string) => {
        try {
            setImgSrc(await generateQrCode(text));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        generateQR(walletAddress);
    }, [walletAddress]);

    return (
        <Box textAlign={"center"}>
            <Image src={imgSrc} mx="auto" display={"block"} w={imgWidth} />
            {showFullAddress ? (
                <Text fontFamily={"Martian"} mt="2" px="10" fontWeight={"600"} fontSize={"14px"}>
                    {walletAddress}
                </Text>
            ) : (
                <Flex align="center" gap="1" justify={"center"}>
                    <Text fontFamily={"Martian"} fontWeight={"600"} fontSize={"14px"}>
                        {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                    </Text>
                    <Image src={IconCopy} onClick={doCopy} w="20px" h="20px" cursor={"pointer"} />
                </Flex>
            )}
        </Box>
    );
}
