import React, { useEffect, useState } from "react";
import ActivityItem from "./comp/ActivityItem";
import { Box } from "@chakra-ui/react";
import IconEmpty from "@src/assets/empty.svg";
import IconLoading from "@src/assets/activity-loading.gif";
import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import { Image } from "@chakra-ui/react";
import scanApi from "@src/lib/scanApi";
import { useAddressStore } from "@src/store/address";

export default function Activities() {
    const {selectedAddress} = useAddressStore()
    const [loading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState<any>([]);

    const getHistory = async () => {
        setLoading(true);
        const res = await scanApi.op.list(selectedAddress, config.chainId);
        setLoading(false);
        setHistoryList(res.data.ops);
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <Box color="#1e1e1e" fontSize={"14px"} lineHeight={"1"}>
            {!loading && (!historyList || historyList.length === 0) && (
                <>
                    <img src={IconEmpty} className="w-32 mx-auto my-4 block" />
                    <div className="text-center">No activities</div>
                </>
            )}
            {loading && <Image src={IconLoading} />}
            {historyList.map((item: any, idx: number) => (
                <ActivityItem key={idx} idx={idx} item={item} />
            ))}
        </Box>
    );
}
