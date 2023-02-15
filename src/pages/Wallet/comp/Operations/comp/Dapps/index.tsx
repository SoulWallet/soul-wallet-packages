import React, { useEffect, useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";

export default function Dapps() {
    console.log("heyeeeee");
    return (
        <div className=" grid grid-cols-2 gap-y-2 gap-x-3 px-6 pt-3">
            {config.dappsList.map((item) => (
                <a
                    target="_blank"
                    href={item.link}
                    key={item.title}
                    className="dapp-item-shadow rounded-lg p-2 gap-[6px] flex bg-white hover:bg-gray-100"
                >
                    <img src={item.icon} className="w-12 h-12" />

                    <div className="">
                        <div className="text-gray80 font-bold mb-[2px]">
                            {item.title}
                        </div>
                        <div className="text-gray60">{item.category}</div>
                    </div>
                </a>
            ))}
        </div>
    );
}
