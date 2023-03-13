import React, { useState } from "react";
import cn from "classnames";
import Assets from "./comp/Assets";
import Dapps from "./comp/Dapps";
import useWalletContext from "@src/context/hooks/useWalletContext";
import Activitys from "./comp/Activitys";
const tabs = ["assets", "activity", "Dapps"];

export default function Operations() {
    const { walletType } = useWalletContext();
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    return (
        <>
            <div className="py-3 relative flex-1">
                <div className="flex">
                    {tabs.map((item, index) => (
                        <a
                            key={index}
                            className={cn(
                                "py-3 text-center flex-1 select-none cursor-pointer capitalize border-b border-color text-[#737373] text-sm leading-none",
                                activeTabIndex === index && "border-blue text-blue text-base font-bold",
                            )}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                <div className={cn("overflow-y-auto", walletType === "eoa" ? "h-[150px]" : "h-[230px]")}>
                    {activeTabIndex === 0 && <Assets />}
                    {activeTabIndex === 1 && <Activitys />}
                    {activeTabIndex === 2 && <Dapps />}
                </div>
            </div>
        </>
    );
}
