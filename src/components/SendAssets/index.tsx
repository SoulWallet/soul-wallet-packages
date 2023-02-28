import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import BN from "bignumber.js";
import IconClose from "@src/assets/icons/close.svg";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useTransaction from "@src/hooks/useTransaction";
import { useNavigate } from "react-router-dom";
import { useBalanceStore } from "@src/store/balanceStore";
import cn from "classnames";
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
    const navigate = useNavigate();
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

        const tokenBalance = balance.get(tokenAddress);

        if (!tokenBalance || new BN(amount).isGreaterThan(tokenBalance)) {
            toast.error("Balance not enough");
            return;
        }
        setSending(true);
        try {
            if (tokenAddress === config.zeroAddress) {
                await sendEth(receiverAddress, amount);
            } else {
                await sendErc20(tokenAddress, receiverAddress, amount);
            }
            goBack();
        } finally {
            setSending(false);
        }
    };

    // const getBalance = async () => {
    //     let res = "";
    //     if (tokenAddress === config.zeroAddress) {
    //         res = await getEthBalance();
    //     } else {
    //         res = await erc20Contract.balanceOf(tokenAddress);
    //     }

    //     console.log("balance is", res);
    //     setBalance(res);
    // };

    const goBack = () => {
        navigate("/wallet");
    };

    // useEffect(() => {
    //     getBalance();
    // }, []);

    return (
        <div className={cn("flex flex-col justify-between", step === 1 && "pb-[100px]")}>
            <div>
                <div className={cn("p-6 flex items-center justify-between", step === 1 && "pb-3")}>
                    <div className="page-title">Send to</div>
                    {step === 0 && <img src={IconClose} className="w-6 h-6 cursor-pointer" onClick={goBack} />}
                </div>

                {step === 0 && (
                    <div className="px-6">
                        <Input
                            value={receiverAddress}
                            placeholder="Search, public address"
                            onChange={setReceiverAddress}
                            error={errors.receiverAddress}
                            onEnter={confirmAddress}
                            className="address"
                        />
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <div className="rounded-lg bg-gray20 mx-6 break-words p-3 address text-[rgba(0,0,0,.6)]">
                            {receiverAddress}
                        </div>

                        <div className="bg-gray20 my-6 px-6">
                            <div className="pt-4">
                                <TokenSelect label="Asset" selectedAddress={sendToken} onChange={setSendToken} />
                            </div>
                            <div className="py-4">
                                <Input
                                    label="Amount"
                                    value={amount}
                                    placeholder="Send amount"
                                    // memo="$ 5.00 USD"
                                    onChange={setAmount}
                                    error={errors.amount}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {step === 0 && (
                <div className="absolute bottom-12 left-0 right-0 text-center px-6">
                    <Button type="primary" className="w-full" onClick={confirmAddress}>
                        Confirm
                    </Button>
                </div>
            )}
            {step === 1 && (
                <div className="flex gap-4 px-6 py-4 footer-shadow fixed bottom-0 left-0 right-0 bg-white">
                    <Button type="reject" className="flex-1 w-full" onClick={goBack}>
                        Reject
                    </Button>
                    <Button type="primary" className="flex-1 w-full" onClick={() => doSend()} loading={sending}>
                        Confirm
                    </Button>
                </div>
            )}
        </div>
    );
}
