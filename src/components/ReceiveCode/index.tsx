import React, { useState, useEffect } from "react";
import QRCode from "qrcode";
import cn from "classnames";
import IconCopy from "@src/assets/copy.svg";
import { copyText } from "@src/lib/tools";

interface IReceiveCode {
    walletAddress: string;
    addressTop?: boolean;
    imgWidth?: string;
}

export default function ReceiveCode({
    walletAddress,
    imgWidth = 'w-44',
    addressTop = false,
}: IReceiveCode) {
    const [copied, setCopied] = useState<boolean>(false);
    const [imgSrc, setImgSrc] = useState<string>("");

    const doCopy = () => {
        copyText(walletAddress);
        setCopied(true);
    };

    // todo, move to lib
    const generateQR = async (text: string) => {
        try {
            setImgSrc(await QRCode.toDataURL(text, { margin: 2 }));
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        generateQR(walletAddress);
    }, [walletAddress]);

    return (
        <div className="text-center w-full">
            <div
                className={cn(
                    "mb-2 flex gap-2",
                    addressTop ? "flex-col-reverse" : "flex-col",
                )}
            >
                <img src={imgSrc} className={cn("mx-auto block", imgWidth)} />
                <div className="opacity-50 break-words w-5/6 mx-auto text-center text-black address">
                    {walletAddress}
                </div>
            </div>
            <div
                className="flex gap-1 items-center justify-center tooltip cursor-pointer"
                onClick={doCopy}
                data-tip={copied ? "Copied" : "Click to copy"}
                onMouseLeave={() => setTimeout(() => setCopied(false), 400)}
            >
                <img src={IconCopy} />
                <span>Copy</span>
            </div>
        </div>
    );
}
