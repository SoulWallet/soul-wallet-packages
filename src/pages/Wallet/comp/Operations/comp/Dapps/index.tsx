import React from "react";
import config from "@src/config";

export default function Dapps() {
    return (
        <div className=" grid grid-cols-2 gap-y-2 gap-x-3 px-6 pt-3">
            {config.dappsList.map((item) => (
                <a
                    target="_blank"
                    href={item.link}
                    key={item.title}
                    className="dapp-item-shadow rounded-lg p-2 gap-2 flex items-center bg-white hover:bg-gray-100"
                >
                    <img src={item.icon} className="w-10 h-10" />
                    <div className="">
                        <div className="text-gray80 font-bold mb-[2px]">{item.title}</div>
                        <div className="text-gray60">{item.category}</div>
                    </div>
                </a>
            ))}
        </div>
    );
}
