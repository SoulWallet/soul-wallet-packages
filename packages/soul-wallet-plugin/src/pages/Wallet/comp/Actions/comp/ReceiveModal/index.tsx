import React, { useState } from "react";
import IconCopy from "@src/assets/copy.svg";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { copyText } from "@src/lib/tools";
import ImgQrCode from "@src/assets/qrcode.png";

interface IModalProps {
    modalId: string;
    onClose: () => void;
}

export default function ReceiveModal({ modalId, onClose }: IModalProps) {
    const [copied, setCopied] = useState<boolean>(false);
    const { walletAddress } = useWalletContext();

    const doCopy = () => {
        copyText(walletAddress);
        setCopied(true);
    };

    return (
        <div>
            <input type="checkbox" id={modalId} className="modal-toggle" />
            <label className="modal" htmlFor={modalId}>
                <label
                    htmlFor=""
                    className="modal-box w-11/12 max-w-5xl flex flex-col items-center py-8"
                >
                    <img src={ImgQrCode} className="mb-4 w-4/5" />
                    <div className="mb-8 opacity-50 break-words w-4/5 text-center text-black">
                        {walletAddress}
                    </div>
                    <div
                        className="flex gap-1 items-center tooltip cursor-pointer"
                        onClick={doCopy}
                        data-tip={copied ? "Copied" : "Click to copy"}
                        onMouseLeave={() =>
                            setTimeout(() => setCopied(false), 400)
                        }
                    >
                        <img src={IconCopy} />
                        <span>Copy</span>
                    </div>
                </label>
            </label>
        </div>
    );
}
