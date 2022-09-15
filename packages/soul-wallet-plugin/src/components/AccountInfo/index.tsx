import React, { useState } from "react";
import { toast } from "material-react-toastify";
import { useNavigate } from "react-router-dom";
import AddressIcon from "../AddressIcon";
import { copyText } from "@src/lib/tools";
import Button from "@src/components/Button";
import IconCopy from "@src/assets/copy.svg";

interface IProps {
    account: string;
    action: string;
}

export default function AccountInfo({ account, action }: IProps) {
    const navigate = useNavigate();

    const [activated, setActivated] = useState<boolean>(false);
    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);

    const doCopy = () => {
        copyText(account);
        setCopied(true);
    };

    const doActivate = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setActivated(true);
            toast.success("Account activated");
        }, 1500);
    };

    const doRemove = async () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            navigate("/wallet");
            toast.success("Guardian removed");
        }, 1500);
    };

    return (
        <div className="p-4 pt-0 text-center flex flex-col items-center justify-between">
            <AddressIcon width={90} address={account} />
            <div className="text-lg mt-1 mb-2">Account 1</div>
            <div
                className="gap-2 flex items-center cursor-pointer tooltip"
                data-tip={copied ? "Copied" : "Click to copy"}
                onMouseLeave={() => setTimeout(() => setCopied(false), 400)}
                onClick={doCopy}
            >
                <img src={IconCopy} className="w-4 opacity-50" />
                <span className="opacity-50 text-base text-black">
                    {account.slice(0, 4)}...{account.slice(-4)}
                </span>
            </div>
            {action === "activate" && !activated && (
                <Button
                    classNames="btn-blue mb-4 mt-6"
                    onClick={doActivate}
                    loading={loading}
                >
                    Activate wallet
                </Button>
            )}
            {action === "remove" && (
                <Button
                    classNames="btn-red mt-6"
                    onClick={doRemove}
                    loading={loading}
                >
                    Remove
                </Button>
            )}
        </div>
    );
}
