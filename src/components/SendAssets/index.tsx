import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import { Flex, Box, Text, useToast } from "@chakra-ui/react";
import BN from "bignumber.js";
import useTransaction from "@src/hooks/useTransaction";
import { ethers } from "ethers";
import { useBalanceStore } from "@src/store/balance";
import { useAddressStore } from "@src/store/address";
import AmountInput from "./comp/AmountInput";
import AddressInput from "./comp/AddressInput";

interface ISendAssets {
    tokenAddress: string;
}

export default function SendAssets({ tokenAddress = "" }: ISendAssets) {
    const { selectedAddress } = useAddressStore();
    const [amount, setAmount] = useState<string>("");
    const { getTokenBalance } = useBalanceStore();
    const [sendToken, setSendToken] = useState(tokenAddress);
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const toast = useToast();

    const selectedToken = getTokenBalance(sendToken);
    const selectedTokenBalance= BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();

    const { sendErc20, sendEth } = useTransaction();

    const confirmAddress = () => {
        if (!receiverAddress || !ethers.isAddress(receiverAddress)) {
            toast({
                title: "Address not valid",
                status: "error",
            });
            return;
        }
        if (!amount) {
            toast({
                title: "Amount not valid",
                status: "error",
            });
            return;
        }

        if (new BN(amount).isGreaterThan(selectedTokenBalance)) {
            toast({
                title: "Balance not enough",
                status: "error",
            });
            return;
        }

        if (sendToken === ethers.ZeroAddress) {
            sendEth(receiverAddress, amount);
        } else {
            sendErc20(sendToken, receiverAddress, amount, selectedToken.decimals);
        }
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
            </Flex>
            <Button onClick={confirmAddress} w="100%" fontSize={"20px"} py="4" fontWeight={"800"} mt="6">
                Review
            </Button>
        </Box>
    );
}
