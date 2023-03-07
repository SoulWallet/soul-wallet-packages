import React, { useEffect, useState } from "react";
import ActivityItem from "./comp/ActivityItem";
import LogoLoading from "@src/assets/logo-loading.gif";
import IconEmpty from "@src/assets/empty.svg";
import IconLoading from "@src/assets/activity-loading.gif";
import useWalletContext from "@src/context/hooks/useWalletContext";
import soulScanApi from "@src/lib/soulScanApi";
import config from "@src/config";

export default function Activities() {
    const { walletAddress } = useWalletContext();
    const [loading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState<any>([]);

    const getHistory = async () => {
        setLoading(true);
        const res = await soulScanApi.op.getAll({
            chainId: config.chainId,
            entrypointAddress: config.contracts.entryPoint,
            walletAddress: walletAddress,
            // TODO, add pagination
            // option: {

            // }
        });
        setLoading(false);
        // formatHistory(res.data.ops);
        setHistoryList(res.data.ops);
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <div className="pt-2">
            {!loading && (!historyList || historyList.length === 0) && (
                <>
                    <img src={IconEmpty} className="w-32 mx-auto my-4 block" />
                    <div className="text-center">No activities</div>
                </>
            )}
            {loading && (
                <div className="text-center py-2 px-6">
                    <img src={IconLoading} className="w-full" />
                </div>
            )}
            {historyList.map((item: any) => (
                <ActivityItem item={item} key={historyList.trxHash} />
            ))}
        </div>
    );
}
