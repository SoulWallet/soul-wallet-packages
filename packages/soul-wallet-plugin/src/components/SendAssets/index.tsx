import React, { useEffect, useState } from "react";
import Button from "../Button";
import config from "@src/config";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useErc20Contract from "@src/contract/useErc20Contract";
// import IconETH from "@src/assets/tokens/eth.svg";
import { Link } from "react-router-dom";
import { Input } from "../Input";
import { toast } from "material-react-toastify";

interface ErrorProps {
    receiverAddress: string;
    amount: string;
}

interface InfoItemProps {
    title: string;
    value: string;
}

interface ConfirmItemProps {
    label: string;
    title: string;
    value?: string;
    icon?: string;
}

const defaultErrorValues = {
    receiverAddress: "",
    amount: "",
};

interface ISendAssets {
    tokenAddress: string;
}

export default function SendAssets({ tokenAddress }: ISendAssets) {
    const [step, setStep] = useState<number>(0);
    const [sending, setSending] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>("");
    const [balance, setBalance] = useState<string>("");
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const [errors, setErrors] = useState<ErrorProps>(defaultErrorValues);
    const { sendErc20, sendEth, getEthBalance, web3 } = useWalletContext();
    const erc20Contract = useErc20Contract();

    const tokenInfo = config.assetsList.filter(
        (item) => item.address === tokenAddress,
    )[0];

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
        if (amount > balance) {
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
            setStep(2);
        } finally {
            setSending(false);
        }
    };

    const getBalance = async () => {
        let res = "";
        if (tokenAddress === config.zeroAddress) {
            res = await getEthBalance();
        } else {
            res = await erc20Contract.balanceOf(tokenAddress);
        }
        setBalance(res);
    };

    useEffect(() => {
        getBalance();
    }, []);

    const ConfirmItem = ({ label, title, value, icon }: ConfirmItemProps) => {
        return (
            <div className="bg-gray40 py-4 px-6">
                <div className=" opacity-80 mb-2">{label}</div>
                <div className="flex items-center gap-1">
                    {icon && <img src={icon} className="w-11 h-11" />}
                    <div className="flex flex-col">
                        <div className="font-bold text-lg break-all">
                            {title}
                        </div>
                        {value && <div>{value}</div>}
                    </div>
                </div>
            </div>
        );
    };

    const InfoItem = ({ title, value }: InfoItemProps) => {
        return (
            <div className="flex justify-between gap-4">
                <div className="text-sm opacity-80">{title}</div>
                <div className="text-base opacity-60 break-all max-w-xs">
                    {value}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col justify-between h-full-with-sidebar">
            <div>
                {step === 0 && (
                    <div className="px-6 pb-6">
                        <div className="page-title mb-4">Send to</div>
                        <Input
                            value={receiverAddress}
                            placeholder="Search, public address,or ENS"
                            onChange={setReceiverAddress}
                            error={errors.receiverAddress}
                        />
                    </div>
                )}
                {step === 1 && (
                    <div>
                        <div className="px-6 mb-6">
                            <div className="page-title mb-4">Amount</div>
                            <Input
                                value={amount}
                                placeholder="Send amount"
                                onChange={setAmount}
                                error={errors.amount}
                            />
                        </div>
                        <ConfirmItem
                            label="Asset"
                            title={tokenInfo.symbol}
                            icon={tokenInfo.icon}
                            value={`Balance: ${balance} ${tokenInfo.symbol}`}
                        />
                        <div className="h-3" />

                        <ConfirmItem label="Receiver" title={receiverAddress} />
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className=" text-center">
                            <div className=" opacity-80 mb-3">Amount</div>
                            <div className=" font-bold text-2xl mb-4">
                                {amount} {tokenInfo.symbol}
                            </div>
                            <div className="text-green mb-11">Completed</div>
                        </div>

                        <div className="p-6 bg-gray40 flex flex-col gap-6">
                            <InfoItem
                                title="Receiver"
                                value={receiverAddress}
                            />
                            {/** TODO, show tx id here */}
                            {/* <InfoItem title="Tx ID" value="0xcbe1...85049c" /> */}
                            <InfoItem
                                title="Date"
                                value={new Date().toLocaleString()}
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 pb-12">
                {step === 0 && (
                    <Button classNames="btn-blue" onClick={confirmAddress}>
                        Next
                    </Button>
                )}
                {step === 1 && (
                    <Button
                        classNames="btn-blue"
                        onClick={() => doSend()}
                        loading={sending}
                    >
                        Confirm
                    </Button>
                )}
                {step === 2 && (
                    <Link to="/wallet">
                        <Button
                            classNames="btn-blue"
                            onClick={() => setStep(2)}
                        >
                            Done
                        </Button>
                    </Link>
                )}
            </div>
        </div>
    );
}
