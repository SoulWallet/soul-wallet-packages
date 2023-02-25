import React, { useEffect, useState } from "react";
import config from "@src/config";

import useTools from "@src/hooks/useTools";

enum ActivityStatusEn {
    Success,
    Error,
    Pending,
}

interface IActivityItem {
    functionName: string;
    txHash: string;
    status: ActivityStatusEn;
    amount?: string;
}

export default function ActivityItem({ item }: any) {
    const { decodeCalldata, getIconMapping } = useTools();
    const [detail, setDetail] = useState<IActivityItem>();

    const formatItem = async () => {
        const callData = item.userOp.callData;

        const callDataDecode = (await decodeCalldata(callData))[0];

        const functionName = item.userOp.initCode !== "0x" ? "activate" : callDataDecode.functionName;

        const status = item.success ? ActivityStatusEn.Success : ActivityStatusEn.Error;

        setDetail({
            functionName,
            txHash: item.trxHash,
            status,
        });
    };

    useEffect(() => {
        if (!item) {
            return;
        }
        formatItem();
    }, [item]);

    return detail ? (
        <a
            href={`${config.scanUrl}/tx/${detail.txHash}`}
            target="_blank"
            key={detail.txHash}
            className="flex flex-col py-3 px-6 cursor-pointer text-base hover:bg-gray-100"
        >
            <div className="flex items-center justify-between">
                <div className="flex gap-[14px] items-center">
                    <img src={getIconMapping(detail.functionName)} className="h-6 w-6" />

                    <div>
                        <div className="leading-none text-black capitalize">{detail.functionName}</div>
                        {detail.txHash && (
                            <div className=" text-[rgba(0,0,0,.5)] mt-2 text-xs leading-none">
                                {detail.txHash.slice(0, 4)}...
                                {detail.txHash.slice(-4)}
                            </div>
                        )}
                    </div>
                </div>

                <div className="text-sm">
                    {detail.status === 0 && "Success"}
                    {detail.status === 1 && "Error"}
                    {detail.status === 2 && "Pending"}
                </div>
                {/* <div className="text-[rgba(0,0,0,.5)] font-bold">{detail.amount}</div> */}
            </div>
        </a>
    ) : (
        <div></div>
    );
}
