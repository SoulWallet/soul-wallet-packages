import React from "react";
import IconReceive from "@src/assets/icons/receive.svg";
import IconSend from "@src/assets/icons/send.svg";

//todo, need action icons
interface IActivity {
    actionType: string;
    interactAddress: string;
    amount: string;
}

const activityList: IActivity[] = [
    {
        actionType: "Send",
        interactAddress: "0x123123123",
        amount: "1 ETH",
    },
    {
        actionType: "Receive",
        interactAddress: "0x123123123",
        amount: "0.5 ETH",
    },
    {
        actionType: "Receive",
        interactAddress: "0x123123123",
        amount: "0.2 ETH",
    },
];

export default function Activities() {
    return (
        <div className="relative">
            {activityList.map((item) => (
                <div className="flex items-center justify-between py-5 px-3 cursor-pointer text-base hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                        {item.actionType === "Send" && (
                            <img src={IconSend} className="w-10 opacity-50" />
                        )}
                        {item.actionType === "Receive" && (
                            <img
                                src={IconReceive}
                                className="w-10 opacity-50"
                            />
                        )}
                        <div className="flex flex-col">
                            <div>{item.actionType}</div>
                            <div className="flex flex-col justify-between opacity-50 text-black">
                                {item.interactAddress.slice(0, 4)}...
                                {item.interactAddress.slice(-4)}
                            </div>
                        </div>
                    </div>

                    <div>{item.amount}</div>
                </div>
            ))}
        </div>
    );
}
