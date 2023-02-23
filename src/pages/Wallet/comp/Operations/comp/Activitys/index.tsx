import React, { useEffect, useState } from "react";
import IconSend from "@src/assets/activities/send.svg";
import IconContract from "@src/assets/activities/Contract.svg";
import IconActivate from "@src/assets/activities/activate.svg";
import IconAdd from "@src/assets/activities/add.svg";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useTools from "@src/hooks/useTools";
import soulScanApi from "@src/lib/soulScanApi";
import config from "@src/config";

const getIconMapping = (actionName: string) => {
    switch (actionName) {
        case "Send ETH":
            return IconSend;
        case "Send Assets":
            return IconSend;
        case "Activate Wallet":
            return IconActivate;
        case "Set Guardian":
            return IconAdd;
        default:
            return IconContract;
    }
};

export default function Activities() {
    const { walletAddress } = useWalletContext();
    const [loading, setLoading] = useState(false);
    const [historyList, setHistoryList] = useState<any>([]);
    const { decodeCalldata } = useTools();

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
        formatHistory(res.data.ops);
        // setHistoryList(res.data.ops);
    };

    const formatHistory = (rawHistoryList: any) => {
        const finalHistoryList = rawHistoryList.map(async (item: any) => {
            const callData = item.userOp.callData;
            const callDataDecode = await decodeCalldata(callData);
            return {
                txHash: item.trxHash,
            };
        });

        setHistoryList(finalHistoryList);
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <div className="pt-2">
            {!loading && (!historyList || historyList.length === 0) && (
                <div className="text-center py-6">You don't have any activities yet.</div>
            )}
            {loading && <div className="text-center py-6">Loading activities.</div>}
            {historyList.map((item: any) => (
                <a
                    href={`${config.scanUrl}/tx/${item.txHash}`}
                    target="_blank"
                    key={item.txhash}
                    className="flex flex-col py-3 px-6 cursor-pointer text-base hover:bg-gray-100"
                >
                    <div className="flex items-center justify-between">
                        <div className="flex gap-[14px] items-center">
                            <img src={getIconMapping(item.actionName)} className="h-6 w-6" />
                            <div className="flex flex-col">
                                <div className="leading-none text-black">{item.actionName}</div>
                            </div>
                        </div>
                        <div className="text-[rgba(0,0,0,.5)] font-bold">{item.amount}</div>
                    </div>

                    {item.txHash && (
                        <div className="flex flex-col justify-between text-[rgba(0,0,0,.5)] mt-1 text-xs leading-none pl-[38px]">
                            {item.txHash.slice(0, 4)}...
                            {item.txHash.slice(-4)}
                        </div>
                    )}
                </a>
            ))}
        </div>
    );
}
