import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountSettingModal from "../AccountSettingModal";
import AddressIcon from "../AddressIcon";
import cn from "classnames";
import { copyText } from "@src/lib/tools";
import Button from "@src/components/Button";
import IconCopy from "@src/assets/copy.svg";

interface IProps {
    account: string;
    action: string;
}

export default function AccountInfo({ account, action }: IProps) {
    const [copied, setCopied] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [accountSettingModalVisible, setAccountSettingModalVisible] = useState<boolean>(false);
    const { walletType } = useWalletContext();
    const navigate = useNavigate();

    const doCopy = () => {
        copyText(account);
        setCopied(true);
    };

    return (
        <div className="flex flex-col items-center justify-between">
            <div className="flex items-center justify-between pt-[18px] pb-4 px-6 w-full">
                <div>
                    <div className="text-black font-bold text-lg mb-2 text-left">Account 1</div>
                    <div
                        className="gap-1 flex items-center cursor-pointer tooltip address"
                        data-tip={copied ? "Copied" : "Copy address"}
                        onMouseLeave={() => setTimeout(() => setCopied(false), 400)}
                        onClick={doCopy}
                    >
                        <img src={IconCopy} className="w-4" />
                        <span className="opacity-50 text-base text-black">
                            {account.slice(0, 5)}...{account.slice(-4)}
                        </span>
                    </div>
                </div>

                <a
                    className={cn(
                        "cursor-pointer border-4 flex",
                        accountSettingModalVisible ? "z-[100] rounded-full relative border-blue" : "border-transparent",
                    )}
                    onClick={() => setAccountSettingModalVisible((prev) => !prev)}
                >
                    <AddressIcon width={48} address={account} />
                </a>
            </div>

            {action === "activate" && walletType === "eoa" && (
                <div className="px-6 pb-3 w-full">
                    <Button
                        type={"primary"}
                        onClick={() => navigate("/activate-wallet")}
                        className="w-full"
                        loading={loading}
                    >
                        Activate wallet
                    </Button>
                </div>
            )}

            {accountSettingModalVisible && (
                <AccountSettingModal onCancel={() => setAccountSettingModalVisible(false)} />
            )}
        </div>
    );
}
