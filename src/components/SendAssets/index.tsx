import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import { Flex, Box, Text } from "@chakra-ui/react";
import BN from "bignumber.js";
import IconClose from "@src/assets/icons/close.svg";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useTransaction from "@src/hooks/useTransaction";
import Address from "../Address";
import { useBalanceStore } from "@src/store/balanceStore";
import cn from "classnames";
import useBrowser from "@src/hooks/useBrowser";
import { Input } from "../Input";
import { TokenSelect } from "../TokenSelect";
import { toast } from "material-react-toastify";

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
    const { navigate } = useBrowser();
    const [step, setStep] = useState<number>(0);
    const [sending, setSending] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>("");
    const { balance } = useBalanceStore();
    const [sendToken, setSendToken] = useState(tokenAddress);
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const [errors, setErrors] = useState<ErrorProps>(defaultErrorValues);
    const { web3 } = useWalletContext();

    const { sendErc20, sendEth } = useTransaction();

    const confirmAddress = () => {
        if (!receiverAddress || !web3.utils.isAddress(receiverAddress)) {
            toast.error("Address not valid");
            return;
        }
        setStep(1);
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
            goBack();
        } finally {
            setSending(false);
        }
    };

    const goBack = () => {
        navigate("wallet");
    };

    return (
        <Box>
            <Text fontSize="20px" fontWeight="800" color="#1e1e1e" mb="6">
                Send
            </Text>
            <Button onClick={confirmAddress} w="100%">Review</Button>
        </Box>
        // <div className={cn("flex flex-col justify-between", step === 1 && "pb-[100px]")}>
        //     <div>
        //         {step === 0 && (
        //             <div className="px-6">
        //                 <Input
        //                     value={receiverAddress}
        //                     placeholder="Search, public address"
        //                     onChange={setReceiverAddress}
        //                     error={errors.receiverAddress}
        //                     onEnter={confirmAddress}
        //                     className="address"
        //                 />
        //             </div>
        //         )}
        //         {step === 1 && (
        //             <div>
        //                 <div className="mx-6">
        //                     <Address value={receiverAddress} />
        //                 </div>
        //                 <div className="bg-gray20 my-6 px-6">
        //                     <div className="pt-4">
        //                         <TokenSelect label="Asset" selectedAddress={sendToken} onChange={setSendToken} />
        //                     </div>
        //                     <div className="py-4">
        //                         <Input
        //                             label="Amount"
        //                             value={amount}
        //                             placeholder="Send amount"
        //                             // memo="$ 5.00 USD"
        //                             onChange={setAmount}
        //                             error={errors.amount}
        //                         />
        //                     </div>
        //                 </div>
        //             </div>
        //         )}
        //     </div>

        // </div>
    );
}
