import React, { useState } from "react";
import IconToggle from "@src/assets/icons/toggle.svg";
import { ITokenSelect } from "@src/types/ITokenSelect";
import config from "@src/config";

const defaultToken = config.assetsList[0];

export function TokenSelect({ label }: ITokenSelect) {
    const [modalVisible, setModalVisible] = useState(false);
    return (
        <div>
            <div className="mb-2 text-gray60">{label}</div>
            <div
                onClick={() => setModalVisible(true)}
                className="token-select p-2 pr-3 flex items-center justify-between text-black cursor-pointer"
            >
                <div className="flex items-center gap-1 ">
                    <img src={defaultToken.icon} className="w-12" />
                    <div>
                        <div className="leading-none text-lg font-bold  mb-2">
                            {defaultToken.symbol}
                        </div>
                        <div className="leading-none">Balance: 1000 ETH</div>
                    </div>
                </div>

                <img src={IconToggle} className="w-3" />
            </div>
        </div>
    );
}
