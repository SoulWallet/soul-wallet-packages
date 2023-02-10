import React, { useState } from "react";
import { toast } from "material-react-toastify";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AddressIcon from "../AddressIcon";
import useWallet from "@src/hooks/useWallet";
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
    const { walletType, getWalletType } = useWalletContext();
    const { activateWalletETH } = useWallet();

    const doCopy = () => {
        copyText(account);
        setCopied(true);
    };

    const doActivate = async () => {
        setLoading(true);
        try {
            await activateWalletETH();
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
        <div className="flex flex-col items-center justify-between">
            <div className="flex items-center justify-between pt-[18px] pb-5 px-6 w-full border-b border-color">
                <div>
                    <div className="text-black font-bold text-lg mb-2 text-left">
                        Account 1
                    </div>
                    <div
                        className="gap-2 flex items-center cursor-pointer tooltip"
                        data-tip={copied ? "Copied" : "Click to copy"}
                        onMouseLeave={() =>
                            setTimeout(() => setCopied(false), 400)
                        }
                        onClick={doCopy}
                    >
                        <img src={IconCopy} className="w-4" />
                        <span className="opacity-50 text-base text-black">
                            {account.slice(0, 4)}...{account.slice(-4)}
                        </span>
                    </div>
                </div>

                <AddressIcon width={48} address={account} />
            </div>

            {action === "activate" && walletType === "eoa" && (
                <div className="px-6 py-4 w-full">
                    <Button
                        classNames="btn-blue w-full"
                        onClick={doActivate}
                        loading={loading}
                    >
                        Activate wallet
                    </Button>
                </div>
            )}
        </div>
    );
}
