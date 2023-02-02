import React, { useState } from "react";
import { toast } from "material-react-toastify";
import { useNavigate } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AddressIcon from "../AddressIcon";
import { copyText } from "@src/lib/tools";
import Button from "@src/components/Button";
import IconCopy from "@src/assets/copy.svg";

interface IProps {
    account: string;
    action: string;
}

// todo, add loading for whole page before get account
export default function AccountInfo({ account, action }: IProps) {
    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const { walletType, getWalletType, activateWallet } = useWalletContext();

    const doCopy = () => {
        copyText(account);
        setCopied(true);
    };

    const doActivate = async () => {
        setLoading(true);
        try {
            await activateWallet();
            // TODO, listen to activated wallet event, then call the following
            getWalletType();
            toast.success("Account activated");
        } catch (err) {
            toast.error("Failed to activate account");
            console.log("activate error", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 pt-0 text-center flex flex-col items-center justify-between">
            {account ? (
                <AddressIcon width={64} address={account} />
            ) : (
                <div className="w-[64px] h-[64px] block bg-white" />
            )}

            <div className="text-lg mt-1 mb-2">Soul Wallet</div>

            {account ? (
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
            ) : (
                <div className="h-6"></div>
            )}

            {action === "activate" && walletType === "eoa" && (
                <Button
                    classNames="btn-blue mb-4 mt-6"
                    onClick={doActivate}
                    loading={loading}
                >
                    Activate wallet
                </Button>
            )}
        </div>
    );
}
