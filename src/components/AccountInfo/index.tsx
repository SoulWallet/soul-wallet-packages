import React, { useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import AccountSettingModal from "../AccountSettingModal";
import { toast } from "material-react-toastify";
import config from "@src/config";
import AddressIcon from "../AddressIcon";
import cn from "classnames";
import { copyText } from "@src/lib/tools";
import Button from "@src/components/Button";
import IconCopy from "@src/assets/copy.svg";
import useBrowser from "@src/hooks/useBrowser";

interface IProps {
    account: string;
    action: string;
}

export default function AccountInfo({ account, action }: IProps) {
    // const [copied, setCopied] = useState<boolean>(false);
    const [accountSettingModalVisible, setAccountSettingModalVisible] = useState<boolean>(false);
    const { walletType } = useWalletContext();
    const { navigate } = useBrowser();

    const doCopy = () => {
        copyText(`${config.addressPrefix}${account}`);
        // setCopied(true);
        toast.success("Copied");
    };

    return (
        <div className="flex flex-col items-center justify-between">
            <div className="flex items-center justify-between pt-[18px] pb-4 px-6 w-full">
                <div>
                    <div className="text-black font-bold text-lg mb-2 text-left">Account 1</div>
                    <div
                        className="gap-1 flex items-center cursor-pointer tooltip address"
                        data-tip="Copy address"
                        onClick={doCopy}
                    >
                        <img src={IconCopy} className="w-4" />
                        <span className="opacity-50 text-base text-black">
                            {config.addressPrefix}
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
                    <Button type={"primary"} onClick={() => navigate("activate-wallet")} className="w-full">
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
