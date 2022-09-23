import React, { useState } from "react";
import { toast } from "material-react-toastify";
import { useNavigate } from "react-router-dom";
import api from "@src/lib/api";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AddressIcon from "../AddressIcon";
import { copyText, getLocalStorage } from "@src/lib/tools";
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
    const { account: userAddress, activateWallet } = useWalletContext();

    const doCopy = () => {
        copyText(account);
        setCopied(true);
    };

    const doActivate = async () => {
        setLoading(true);
        await activateWallet();
        // setTimeout(() => {
        //     setLoading(false);
        //     setActivated(true);
        //     toast.success("Account activated");
        // }, 1500);
    };

    const doRemoveGuardian = async () => {
        setLoading(true);

        const res: any = await api.guardian.remove({
            email: await getLocalStorage("email"),
            wallet_address: userAddress,
            guardian: account,
        });

        if (res.code === 200) {
            toast.success("Removed guardian");
            setLoading(false);
            navigate("/wallet");
        }
    };

    return (
        <div className="p-4 pt-0 text-center flex flex-col items-center justify-between">
            <AddressIcon width={72} address={account} />
            <div className="text-lg mt-1 mb-2">Soul Wallet</div>
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
                    onClick={doRemoveGuardian}
                    loading={loading}
                >
                    Remove
                </Button>
            )}
        </div>
    );
}
