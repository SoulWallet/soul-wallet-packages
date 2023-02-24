import React, { useEffect, useState } from "react";
import ActivityItem from "./comp/ActivityItem";
import LogoLoading from "@src/assets/logo-loading.gif";

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
                <div className="text-center py-6">You don't have any activities yet.</div>
            )}
            {/* {loading && <img src={LogoLoading} />} */}
            {loading && (
                <div className="text-center py-2">
                    <img src={LogoLoading} className="w-1/2 mx-auto block" />
                </div>
            )}
            {historyList.map((item: any) => (
                <ActivityItem item={item} />
            ))}
        </div>
    );
}
