import React, { useState } from "react";
import cn from "classnames";
import Assets from "./comp/Assets";
import Activitys from "./comp/Activitys";
const tabs = ["assets", "activity", "guardians"];

export default function Operations() {
    const [activeTabIndex, setActiveTabIndex] = useState<number>(0);

    return (
        <>
            <div className="p-0 pt-0 relative flex-1">
                <div className="flex">
                    {tabs.map((item, index) => (
                        <a
                            key={index}
                            className={cn(
                                "py-4 text-xs text-center flex-1 cursor-pointer capitalize border-b border-gray10",
                                activeTabIndex === index && "border-blue",
                            )}
                            onClick={() => setActiveTabIndex(index)}
                        >
                            {item}
                        </a>
                    ))}
                </div>

                {activeTabIndex === 0 && <Assets />}
                {activeTabIndex === 1 && <Activitys />}
            </div>
        </>
    );
}
