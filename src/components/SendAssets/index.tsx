import React, { useEffect, useState } from "react";
import Button from "../Button";
import { Flex, Box, Text, useToast } from "@chakra-ui/react";
import BN from "bignumber.js";
import useTransaction from "@src/hooks/useTransaction";
import { ethers } from "ethers";
import { useBalanceStore } from "@src/store/balance";
import AmountInput from "./comp/AmountInput";
import { AddressInput, AddressInputReadonly } from "./comp/AddressInput";
import { toShortAddress } from "@src/lib/tools";
import useConfig from "@src/hooks/useConfig";

interface ISendAssets {
    tokenAddress: string;
}

export default function SendAssets({ tokenAddress = "" }: ISendAssets) {
    const [amount, setAmount] = useState<string>("");
    const { getTokenBalance } = useBalanceStore();
    const [sendToken, setSendToken] = useState(tokenAddress);
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const toast = useToast();
    const { selectedAddressItem } = useConfig();

    const selectedToken = getTokenBalance(sendToken);
    const selectedTokenBalance = BN(selectedToken.tokenBalance).shiftedBy(-selectedToken.decimals).toFixed();

    const { sendErc20, sendEth } = useTransaction();

    const confirmAddress = () => {
        const trimedAddress = receiverAddress ? receiverAddress.trim() : "";
        if (!trimedAddress || !ethers.isAddress(trimedAddress)) {
            toast({
                title: "Invalid address",
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
            sendEth(trimedAddress, amount);
        } else {
            sendErc20(sendToken, trimedAddress, amount, selectedToken.decimals);
        }
    };

    return (
        <Box>
            <Text fontSize="20px" fontWeight="800" mb="6">
                Send
            </Text>
            <Flex flexDir={"column"} gap="5">
                <AmountInput sendToken={sendToken} amount={amount} onChange={setAmount} onTokenChange={setSendToken} />
                <AddressInputReadonly
                    label="From"
                    value={selectedAddressItem.title}
                    memo={toShortAddress(selectedAddressItem.address, 6, 4)}
                />
                <AddressInput
                    label="To"
                    placeholder="Enter recipient address"
                    value={receiverAddress}
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
