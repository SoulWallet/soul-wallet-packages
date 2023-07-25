import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import { Flex, Box, Text } from "@chakra-ui/react";
import BN from "bignumber.js";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useTransaction from "@src/hooks/useTransaction";
import Address from "../Address";
import { useBalanceStore } from "@src/store/balanceStore";
import cn from "classnames";
import useBrowser from "@src/hooks/useBrowser";
import { Input } from "../Input";
import { TokenSelect } from "../TokenSelect";
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
        if (!receiverAddress || !web3.utils.isAddress(receiverAddress)) {
            toast.error("Address not valid");
            return;
        }
        // go sign page

        // actionType: param.get("action"),
        // tabId: param.get("tabId"),
        // origin: param.get("origin"),
        // txns: param.get("txns"),
        // data: param.get("data"),
        navigate("sign?action=transfer");
    };

    const doSend = async () => {
        if (!amount) {
            toast.error("Amount not valid");
            return;
        }

        const tokenBalance = balance.get(sendToken);

        if (!tokenBalance || new BN(amount).isGreaterThan(tokenBalance)) {
            toast.error("Balance not enough");
            return;
        }
        setSending(true);
        try {
            if (sendToken === config.zeroAddress) {
                await sendEth(receiverAddress, amount);
            } else {
                await sendErc20(sendToken, receiverAddress, amount);
            }
        } finally {
            setSending(false);
        }
    };

    return (
        <Box>
            <Text fontSize="20px" fontWeight="800" color="#1e1e1e" mb="6">
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
                <Flex fontSize="12px" fontWeight={"500"} fontFamily={"Martian"} flexDir={"column"}>
                    <Flex align="center" justify={"space-between"} px="4">
                        <Text>Gas fee ($2.22)</Text>
                        <Flex gap="2">
                            <Text>2.22</Text>
                            <GasSelect />
                        </Flex>
                    </Flex>
                </Flex>
            </Flex>
            <Button onClick={confirmAddress} w="100%" fontSize={"20px"} py="4" fontWeight={"800"} mt="6">
                Review
            </Button>
        </Box>
    );
}
