import React from "react";
import IconChevronRight from "@src/assets/chevron-right.svg";
import config from "@src/config";

export default function Assets() {
    return (
        <div>
            {config.assetsList.map((item) => (
                <div key={item.symbol} className="flex items-center justify-between py-5 px-3 cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                        <img src={item.icon} className="w-10" />
                        <div className="text-sm">
                            {/* {item.balance} {item.symbol} */}
                        </div>
                    </div>

                    <img src={IconChevronRight} />
                </div>
            ))}
        </div>
    );
}
