import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import { Flex, Box, Text, useToast } from "@chakra-ui/react";
import BN from "bignumber.js";
import useTransaction from "@src/hooks/useTransaction";
import { ethers } from "ethers";
import { useBalanceStore } from "@src/store/balanceStore";
import { useAddressStore } from "@src/store/address";
import AmountInput from "./comp/AmountInput";
import AddressInput from "./comp/AddressInput";
import GasSelect from "./comp/GasSelect";

interface ErrorProps {
    receiverAddress: string;
    amount: string;
}

const defaultErrorValues = {
    receiverAddress: "",
    amount: "",
};

interface ISendAssets {
    tokenAddress: string;
}

export default function SendAssets({ tokenAddress = "" }: ISendAssets) {
    const { selectedAddress } = useAddressStore();
    const [amount, setAmount] = useState<string>("");
    const { getTokenBalance } = useBalanceStore();
    const [sendToken, setSendToken] = useState(tokenAddress);
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const toast = useToast()

    const { sendErc20, sendEth } = useTransaction();

    const confirmAddress = () => {
        if (!receiverAddress || !ethers.isAddress(receiverAddress)) {
            toast({
                title: "Address not valid",
                status: "error",
            })
            return;
        }
        if (!amount) {
            toast({
                title: "Amount not valid",
                status: "error",
            })
            return;
        }

        if (new BN(amount).isGreaterThan(getTokenBalance(sendToken))) {
            toast({
                title: "Balance not enough",
                status: "error",
            })
            // return;
        }

        if (sendToken === config.zeroAddress) {
            sendEth(receiverAddress, amount);
        } else {
            sendErc20(sendToken, receiverAddress, amount);
        }
        // go sign page

        // actionType: param.get("action"),
        // tabId: param.get("tabId"),
        // origin: param.get("origin"),
        // txns: param.get("txns"),
        // data: param.get("data"),
    };

    return (
        <Box>
            <Text fontSize="20px" fontWeight="800" mb="6">
                Send
            </Text>
            <Flex flexDir={"column"} gap="5">
                <AmountInput sendToken={sendToken} amount={amount} onChange={setAmount} onTokenChange={setSendToken} />
                <AddressInput label="From" address={selectedAddress} disabled />
                <AddressInput
                    label="To"
                    address={receiverAddress}
                    onChange={(e: any) => setReceiverAddress(e.target.value)}
                    onEnter={confirmAddress}
                />
                {/* <InfoWrap>
                    <InfoItem>
                        <Text>Gas fee ($2.22)</Text>
                        <Flex gap="2">
                            <Text>2.22</Text>
                            <GasSelect gasToken={payToken} onChange={setPayToken} />
                        </Flex>
                    </InfoItem>
                </InfoWrap> */}
            </Flex>
            <Button onClick={confirmAddress} w="100%" fontSize={"20px"} py="4" fontWeight={"800"} mt="6">
                Review
            </Button>
        </Box>
    );
}
