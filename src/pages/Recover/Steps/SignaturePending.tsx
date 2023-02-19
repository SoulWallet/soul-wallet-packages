import Button from "@src/components/Button";
import Icon from "@src/components/Icon";
import Modal from "@src/components/Modal";
import closeIcon from "@src/assets/icons/close.svg";
import React, { useState } from "react";

enum SignatureStatusEn {
    Signed = 1,
    Pending = 2,
    Error = 3,
}

// op_hash: opHash,
//     guardian_address: address,
//     guardian_signature: signature,
//     timestamp: new Date()

const SignatureStatusMap = {
    [SignatureStatusEn.Signed]: { text: "Signed", color: "text-[#1BB85D]" },
    [SignatureStatusEn.Pending]: { text: "Waiting", color: "text-[#999999]" },
    [SignatureStatusEn.Error]: { text: "Error, need to re-sign", color: "text-[#F5CC43]" },
};

interface ISignatureVerificationItem {
    // id: string;
    name: string;
    address: string;
    status: SignatureStatusEn;
}

const SignatureItem = ({ name, address, status }: ISignatureVerificationItem) => (
    <div className="px-24 py-12 even:bg-[#FAFAFA]">
        <div className="flex flex-row justify-between items-center">
            <span className="text-black text-xl">{name}</span>
            <span className={"text-base " + SignatureStatusMap[status].color}>{SignatureStatusMap[status].text}</span>
        </div>
        <p className="text-[#4D4D4D] whitespace-nowrap mt-8">{address}</p>
    </div>
);

const mockData: ISignatureVerificationItem[] = [
    {
        name: "Guardian 1",
        address: "0x12345678901234567890123456789345678901234567890",
        status: SignatureStatusEn.Signed,
    },
    {
        name: "Guardian 2",
        address: "0x123456789012345678901234567890",
        status: SignatureStatusEn.Pending,
    },
    {
        name: "Guardian 3",
        address: "0x123456789012345678901234567890",
        status: SignatureStatusEn.Error,
    },
    {
        name: "Guardian 4",
        address: "0x123456789012345678901234567890",
        status: SignatureStatusEn.Signed,
    },
    {
        name: "Guardian 5",
        address: "0x123456789012345678901234567890",
        status: SignatureStatusEn.Signed,
    },
    {
        name: "Guardian 6",
        address: "0x123456789012345678901234567890",
        status: SignatureStatusEn.Signed,
    },
];

const SignaturePending = () => {
    const [showShareModal, setShowShareModal] = useState(false);
    const [shareUrl, setShareUrl] = useState("https://soulwallet.io/recover/1234567890"); // TODO: get from api

    const handleOpenShareModal = () => {
        setShowShareModal(true);
    };

    const handleCloseShareModal = () => {
        setShowShareModal(false);
    };

    const handleNext = () => {
        // TODO: jump to where?
    };
    return (
        <div className="relative pb-100 -mx-16">
            <div className="max-h-200 overflow-y-scroll">
                {mockData.map((item, idx) => (
                    <SignatureItem key={idx} {...item} />
                ))}
            </div>
            <div className="bg-white absolute  inset-x-0 bottom-0 w-full h-100 flex flex-row items-center justify-evenly gap-x-20 rounded-b-16 px-16">
                <Button className="w-[calc(50%-18px)]" onClick={handleOpenShareModal}>
                    Share recovery URL
                </Button>
                {/* TODO: all signed? */}
                <Button className="w-[calc(50%-18px)]" onClick={handleNext} disable>
                    Next
                </Button>
            </div>

            <Modal visible={showShareModal} className="bg-white text-black">
                <div>
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-xl">Share recovery URL to your guardians</h1>
                        <Icon src={closeIcon} onClick={handleCloseShareModal} className="cursor-pointer" />
                    </div>
                    <p className="my-20">
                        Share recovery URL to your guardiansShare this link with your guardians for them to connect
                        wallet and sign.
                    </p>

                    <div>
                        <a target="_blank" href={shareUrl} className="text-purple" rel="noreferrer">
                            {shareUrl}
                        </a>
                        <Button
                            type="primary"
                            className="mt-12"
                            onClick={() => {
                                navigator?.clipboard?.writeText(shareUrl).then(() => {
                                    alert("Copied to clipboard");
                                });
                            }}
                        >
                            Copy Link
                        </Button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default SignaturePending;
