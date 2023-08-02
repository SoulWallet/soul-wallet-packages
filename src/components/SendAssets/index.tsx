import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import { Flex, Box, Text } from "@chakra-ui/react";
import BN from "bignumber.js";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useTransaction from "@src/hooks/useTransaction";
import Address from "../Address";
import {ethers} from 'ethers'
import { useBalanceStore } from "@src/store/balanceStore";
import cn from "classnames";
import useBrowser from "@src/hooks/useBrowser";
import { Input } from "../Input";
import { TokenSelect } from "../TokenSelect";
import { InfoWrap, InfoItem } from "../SignTransaction";
import { toast } from "material-react-toastify";
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
    const { walletAddress } = useWalletContext();
    const [sending, setSending] = useState<boolean>(false);
    const { navigate } = useBrowser();
    const [amount, setAmount] = useState<string>("");
    const { balance } = useBalanceStore();
    const [sendToken, setSendToken] = useState(tokenAddress);
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const { web3 } = useWalletContext();

    const { sendErc20, sendEth } = useTransaction();

    const confirmAddress = () => {
        if (!receiverAddress || !ethers.isAddress(receiverAddress)) {
            toast.error("Address not valid");
            return;
        }
        if (!amount) {
            toast.error("Amount not valid");
            return;
        }
        const tokenBalance = balance.get(sendToken);

        if (!tokenBalance || new BN(amount).isGreaterThan(tokenBalance)) {
            toast.error("Balance not enough");
            return;
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
                <AddressInput label="From" address={walletAddress} disabled />
                <AddressInput
                    label="To"
                    address={receiverAddress}
                    onChange={(e: any) => setReceiverAddress(e.target.value)}
                />
                <InfoWrap>
                    <InfoItem>
                        <Text>Gas fee ($2.22)</Text>
                        <Flex gap="2">
                            <Text>2.22</Text>
                            <GasSelect />
                        </Flex>
                    </InfoItem>
                </InfoWrap>
            </Flex>
            <Button onClick={confirmAddress} w="100%" fontSize={"20px"} py="4" fontWeight={"800"} mt="6">
                Review
            </Button>
        </Box>
    );
}
