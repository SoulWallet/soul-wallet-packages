import React, { useState } from "react";
import Button from "../Button";
import IconETH from "@src/assets/tokens/eth.svg";
import { Link } from "react-router-dom";
import { Input } from "../Input";

interface ErrorProps {
    receiverAddress: string;
}

interface InfoItemProps {
    title: string;
    value: string;
}

interface ConfirmItemProps {
    label: string;
    title: string;
    value: string;
    icon?: string;
}

const defaultErrorValues = {
    receiverAddress: "",
};

export default function SendAssets() {
    const [step, setStep] = useState<number>(0);
    const [receiverAddress, setReceiverAddress] = useState<string>("");
    const [errors, setErrors] = useState<ErrorProps>(defaultErrorValues);

    const ConfirmItem = ({ label, title, value, icon }: ConfirmItemProps) => {
        return (
            <div className="bg-gray40 py-4 px-6">
                <div className=" opacity-80 mb-2">{label}</div>
                <div className="flex items-center">
                    {icon && <img src={icon} className="w-12 h-12" />}
                    <div className="flex flex-col">
                        <div className="font-bold text-lg mb-2">{title}</div>
                        <div>{value}</div>
                    </div>
                </div>
            </div>
        );
    };

    const InfoItem = ({ title, value }: InfoItemProps) => {
        return (
            <div className="flex justify-between">
                <div className="text-sm opacity-80">{title}</div>
                <div className="text-base opacity-60 break-words max-w-xs">
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
                        <div className="px-6">
                            <div className="page-title mb-4">Send to</div>
                            <div className="p-3 rounded-lg text-base mb-6 receiver-address-box">
                                {receiverAddress}
                            </div>
                        </div>
                        <ConfirmItem
                            label="Asset"
                            title="ETH"
                            icon={IconETH}
                            value="Balance: 1000 ETH"
                        />
                        <div className="h-3" />
                        <ConfirmItem
                            label="Amount"
                            title="100 ETH"
                            value="$164,535 USD"
                        />
                    </div>
                )}

                {step === 2 && (
                    <div>
                        <div className=" text-center">
                            <div className=" opacity-80 mb-3">Amount</div>
                            <div className=" font-bold text-2xl mb-4">
                                100 ETH
                            </div>
                            <div className="text-green mb-11">Completed</div>
                        </div>

                        <div className="p-6 bg-gray40 flex flex-col gap-6">
                            <InfoItem title="Address" value={receiverAddress} />
                            <InfoItem title="Tx ID" value="0xcbe1...85049c" />
                            <InfoItem
                                title="Date"
                                value="2022-08-15 18:23:54"
                            />
                        </div>
                    </div>
                )}
            </div>

            <div className="px-6 pb-12">
                {step === 0 && (
                    <Button classNames="btn-blue" onClick={() => setStep(1)}>
                        Next
                    </Button>
                )}
                {step === 1 && (
                    <Button classNames="btn-blue" onClick={() => setStep(2)}>
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
