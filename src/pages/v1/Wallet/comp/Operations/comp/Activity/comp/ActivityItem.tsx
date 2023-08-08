import React, { useEffect, useState } from "react";
import config from "@src/config";
import ListItem from "../../ListItem";
import useTools from "@src/hooks/useTools";
import { useChainStore } from "@src/store/chain";

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
        const callDataDecodes = await decodeCalldata(item.chainId, item.entrypointAddress, item.userOp);

        console.log('activity decoded', callDataDecodes)

        const functionNames = callDataDecodes.map((item: any) => item.functionName).join(", ");

        const status = item.success ? ActivityStatusEn.Success : ActivityStatusEn.Error;

        setDetail({
            functionName: functionNames,
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

    if (!detail) {
        return <></>;
    }

    return (
        <a href={`${config.scanUrl}/tx/${detail.txHash}`} target="_blank">
            <ListItem
                idx={item.idx}
                icon={getIconMapping(detail.functionName)}
                title={detail.functionName}
                titleDesc="May 20, 2023"
                amount={"0.23 ETH"}
                amountDesc="to 0x123...1111"
            />
        </a>
    );
}
