import React from "react";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import GasSelect from "../../SendAssets/comp/GasSelect";
import { AddressInput, AddressInputReadonly } from "../../SendAssets/comp/AddressInput";
import { useAddressStore } from "@src/store/address";
import Button from "../../Button";
import { InfoWrap, InfoItem } from "../index";
import BN from "bignumber.js";
import { toShortAddress } from "@src/lib/tools";
import useConfig from "@src/hooks/useConfig";

export default function SignTransaction({
    decodedData,
    sendToAddress,
    sponsor,
    feeCost,
    payToken,
    setPayToken,
    payTokenSymbol,
    loadingFee,
    signing,
    onConfirm,
    origin,
}: any) {
    const { selectedAddress } = useAddressStore();
    const { selectedAddressItem } = useConfig();

    return (
        <>
            <Text fontSize="20px" fontWeight="800" color="#1e1e1e">
                Sign Transaction
            </Text>

            {origin && (
                <Text fontWeight={"600"} mt="1">
                    {origin}
                </Text>
            )}

            <Flex flexDir={"column"} gap="5" mt="6">
                {decodedData && decodedData.length > 0 && (
                    <Box bg="#fff" py="3" px="4" rounded="20px" fontWeight={"800"}>
                        <Box>
                            {decodedData.map((item: any, index: number) => (
                                <Text mr="1" textTransform="capitalize" key={index}>
                                    {decodedData.length > 1 && `${index + 1}.`}
                                    {item.method.name || ""}
                                </Text>
                            ))}
                        </Box>
                    </Box>
                )}

                <AddressInputReadonly
                    label="From"
                    value={selectedAddressItem.title}
                    memo={toShortAddress(selectedAddress)}
                />
                {sendToAddress ? (
                    <AddressInput label="To" value={sendToAddress} disabled={true} />
                ) : (
                    <AddressInput label="To" value={decodedData[0] && decodedData[0].to} disabled={true} />
                )}

                <>
                    <InfoWrap>
                        <InfoItem align={sponsor && "flex-start"}>
                            <Text>Gas fee</Text>
                            {sponsor ? (
                                <Box textAlign={"right"}>
                                    <Flex mb="1" gap="4" justify={"flex-end"}>
                                        {feeCost && (
                                            <Text textDecoration={"line-through"}>
                                                {BN(feeCost.split(" ")[0]).toFixed(6)} {payTokenSymbol}
                                            </Text>
                                        )}
                                        <Text>0 ETH</Text>
                                    </Flex>
                                    <Text color="#898989">Sponsored by {sponsor.sponsorParty || "Soul Wallet"}</Text>
                                </Box>
                            ) : feeCost ? (
                                <Flex gap="2">
                                    <Text>{feeCost.split(" ")[0]}</Text>
                                    <GasSelect gasToken={payToken} onChange={setPayToken} />
                                </Flex>
                            ) : (
                                <Text>Loading...</Text>
                            )}
                        </InfoItem>
                        <InfoItem>
                            <Text>Total</Text>
                            <Text>$1736.78</Text>
                        </InfoItem>
                    </InfoWrap>
                </>
            </Flex>
            <Button
                w="100%"
                fontSize={"20px"}
                py="4"
                fontWeight={"800"}
                mt="6"
                onClick={onConfirm}
                loading={signing}
                disabled={loadingFee && !sponsor}
            >
                Sign
            </Button>
        </>
    );
}
