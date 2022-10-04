import React, { useEffect, useState } from "react";
import IconReceive from "@src/assets/icons/receive.svg";
import IconSend from "@src/assets/icons/send.svg";
import config from "@src/config";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";

//todo, need action icons
// interface IActivity {
//     actionType: string;
//     interactAddress: string;
//     amount: string;
// }

// const activityList: IActivity[] = [
//     {
//         actionType: "Send",
//         interactAddress: "0x123123123",
//         amount: "1 ETH",
//     },
//     {
//         actionType: "Receive",
//         interactAddress: "0x123123123",
//         amount: "0.5 ETH",
//     },
//     {
//         actionType: "Receive",
//         interactAddress: "0x123123123",
//         amount: "0.2 ETH",
//     },
// ];

export default function Activities() {
    const [historyList, setHistoryList] = useState<any>([]);

    const getHistory = async () => {
        const res = (await getLocalStorage("activityHistory")) || [];
        setHistoryList(res);
    };

    useEffect(() => {
        getHistory();
    }, []);

    return (
        <div className="relative">
            {(!historyList || historyList.length === 0) && (
                <div className="text-center py-6">
                    You don't have any activities yet.
                </div>
            )}
            {historyList.map((item: any) => (
                <a
                    href={`${config.scanUrl}/tx/${item.txHash}`}
                    target="_blank"
                    className="flex items-center justify-between py-5 px-3 cursor-pointer text-base hover:bg-gray-100"
                >
                    <div className="flex items-center gap-2">
                        {item.actionName === "Send Assets" && (
                            <img src={IconSend} className="w-10 opacity-50" />
                        )}
                        {item.actionName === "Receive Assets" && (
                            <img
                                src={IconReceive}
                                className="w-10 opacity-50"
                            />
                        )}
                        {/** default contract interaction icon */}
                        {item.actionName !== "Send Assets" &&
                            item.actionName !== "Receive Assets" && (
                                <img
                                    src={IconSend}
                                    className="w-10 opacity-50"
                                />
                            )}
                        <div className="flex flex-col">
                            <div>{item.actionName}</div>
                            {item.txHash && (
                                <div className="flex flex-col justify-between opacity-50 text-black">
                                    {item.txHash.slice(0, 4)}...
                                    {item.txHash.slice(-4)}
                                </div>
                            )}
                        </div>
                    </div>
                    {/* <div>{item.amount}</div> */}
                </a>
            ))}
        </div>
    );
}
