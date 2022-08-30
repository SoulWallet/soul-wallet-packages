import React from "react";
import IconETH from "@src/assets/tokens/eth.svg";
import IconChevronRight from "@src/assets/chevron-right.svg";

const assetsList = [
    {
        icon: IconETH,
        symbol: "ETH",
        balance: "100000",
    },
];

export default function Assets() {
    return (
        <div>
            {assetsList.map((item) => (
                <div className="flex items-center justify-between py-5 px-3 cursor-pointer hover:bg-gray-100">
                    <div className="flex items-center gap-2">
                        <img src={item.icon} className="w-10" />
                        <div className="text-sm">
                            {item.balance} {item.symbol}
                        </div>
                    </div>

                    <img src={IconChevronRight} />
                </div>
            ))}
        </div>
    );
}
