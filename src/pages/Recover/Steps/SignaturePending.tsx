import Button from "@src/components/Button";
import Icon from "@src/components/Icon";
import ModalV2 from "@src/components/ModalV2";
import closeIcon from "@src/assets/icons/close.svg";
import React, { useEffect, useState } from "react";
import BN from "bignumber.js";
import { toast } from "material-react-toastify";
import config from "@src/config";
import api from "@src/lib/api";
import useWallet from "@src/hooks/useWallet";
import { getLocalStorage, removeLocalStorage } from "@src/lib/tools";

enum SignatureStatusEn {
    Signed = 1,
    Pending = 2,
    Error = 3,
}

const SignatureStatusMap = {
    [SignatureStatusEn.Signed]: { text: "Signed", color: "text-[#1BB25D]" },
    [SignatureStatusEn.Pending]: { text: "Waiting", color: "text-[#999999]" },
    [SignatureStatusEn.Error]: { text: "Error, need to re-sign", color: "text-[#F5CC43]" },
};

interface ISignaturesItem {
    address: string;
    signature: string;
    status: SignatureStatusEn;
}

interface ISignaturePending {
    onChange: (statusText: string) => void;
}

const SignatureItem = ({ address, status }: ISignaturesItem) => (
    <div className="px-6 py-3 even:bg-[#FAFAFA]">
        <div className="flex flex-row justify-between items-center">
            <span className="text-black text-xl">Guardian</span>
            <span className={"text-base " + SignatureStatusMap[status].color}>{SignatureStatusMap[status].text}</span>
        </div>
        <p className="text-gray80 whitespace-nowrap mt-2">{address}</p>
    </div>
);

const SignaturePending = ({ onChange }: ISignaturePending) => {
    const [loadingList, setLoadingList] = useState(false);
    const [showShareModal, setShowShareModal] = useState(false);
    const { recoverWallet } = useWallet();
    const [signatureList, setSignatureList] = useState<any>([]);
    const [progress, setProgress] = useState(0);
    const [shareUrl, setShareUrl] = useState("");
    const [opDetail, setOpDetail] = useState<any>({});
    const [opHash, setOpHash] = useState("");
    const [recoveringWallet, setRecoveringWallet] = useState(false);

    const handleOpenShareModal = () => {
        setShowShareModal(true);
    };

    const handleCloseShareModal = () => {
        setShowShareModal(false);
    };

    const doRecover = async () => {
        const finalSignatureList = signatureList.filter((item: any) => !!item.signature);
        // TODO, 0x should be removed
        // finalSignatureList.forEach((item: any) => {
        //     item.signature = `0x${item.signature}`;
        // });

        setRecoveringWallet(true);
        // GET OP
        await recoverWallet(opDetail, finalSignatureList, opHash);
        setRecoveringWallet(false);
        // TOOD, add success page
    };

    const getList = async (opHash: string) => {
        setLoadingList(true);
        setShareUrl(`${config.recoverUrl}/${opHash}`);
        const res: any = await api.recovery.get(opHash);
        let signedNum = 0;
        res.data.signatures.forEach((item: ISignaturesItem) => {
            // check status
            if (item.signature) {
                item.status = SignatureStatusEn.Signed;
                signedNum++;
            } else {
                item.status = SignatureStatusEn.Pending;
            }
        });
        setSignatureList(res.data.signatures);
        // important TODO
        setProgress(Math.ceil((signedNum / res.data.signatures.length) * 100));
        onChange(`${signedNum}/${res.data.signatures.length}`);
        setLoadingList(false);
    };

    const getDetail = async (opHash: string) => {
        const res = await api.recovery.getOp(opHash);
        setOpDetail(res.data.userOp);
        setOpHash(res.data.opHash);
    };

    const getInfo = async () => {
        const opHash = await getLocalStorage("recoverOpHash");

        getList(opHash);
        getDetail(opHash);
    };

    useEffect(() => {
        getInfo();
    }, []);

    return (
        <div className="relative pb-100 -mx-4">
            <div>
                {signatureList.map((item: ISignaturesItem, idx: number) => (
                    <SignatureItem key={idx} {...item} />
                ))}
            </div>
            <div className="bg-white relative inset-x-0 bottom-0 w-full h-[100px] flex flex-row items-center justify-evenly gap-x-5 rounded-b-md px-4">
                <Button className="w-[calc(50%-12px)]" onClick={handleOpenShareModal}>
                    Share URL
                </Button>
                <Button
                    className="w-[calc(50%-12px)]"
                    loading={recoveringWallet}
                    type="primary"
                    disabled={progress < 50}
                    onClick={doRecover}
                >
                    Recover
                </Button>
            </div>

            <ModalV2 visible={true} className="bg-white text-black">
                <div>
                    <div className="flex flex-row justify-between">
                        <h1 className="font-bold text-xl">Share recovery URL to your guardians</h1>
                        <Icon src={closeIcon} onClick={handleCloseShareModal} className="cursor-pointer" />
                    </div>

                    <p className="my-5">
                        Share recovery URL to your guardiansShare this link with your guardians for them to connect
                        wallet and sign.
                    </p>

                    <div className="flex flex-col">
                        <a target="_blank" href={shareUrl} className="text-purple break-words" rel="noreferrer">
                            {shareUrl}
                        </a>
                        <Button
                            type="primary"
                            className="mt-3"
                            onClick={() => {
                                navigator?.clipboard?.writeText(shareUrl).then(() => {
                                    toast.success("Copied to clipboard");
                                });
                            }}
                        >
                            Copy Link
                        </Button>
                    </div>
                </div>
            </ModalV2>
        </div>
    );
};

export default SignaturePending;
