import React, { useEffect, useState } from "react";
import IconSend from "@src/assets/activities/send.svg";
import IconContract from "@src/assets/activities/Contract.svg";
import IconActivate from "@src/assets/activities/activate.svg";
import IconAdd from "@src/assets/activities/add.svg";
import useWalletContext from "@src/context/hooks/useWalletContext";
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
    const [historyList, setHistoryList] = useState<any>([]);

    const getHistory = async () => {
        const res = await soulScanApi.op.getAll({
            chain_id: config.chainId,
            entrypoint: config.contracts.entryPoint,
            wallet_address: walletAddress,
            // TODO, add pagination
            // option: {

            // }
        });
        console.log("his", res);
        setHistoryList(res.data.ops);
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <div className="pt-2">
            {(!historyList || historyList.length === 0) && (
                <div className="text-center py-6">You don't have any activities yet.</div>
            )}
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
