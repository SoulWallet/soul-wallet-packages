import React, { useState } from "react";
import IconToggle from "@src/assets/icons/toggle.svg";
import { ITokenSelect } from "@src/types/ITokenSelect";
import { TokenSelectModal } from "../TokenSelectModal";
import config from "@src/config";

export function TokenSelect({
    label,
    selectedAddress,
    onChange,
}: ITokenSelect) {
    const [tokenModalVisible, setTokenModalVisible] = useState(false);

    const selectedToken = config.assetsList.filter(
        (item: any) => item.address === selectedAddress,
    )[0];

    return (
        <div>
            <div className="mb-2 text-gray60">{label}</div>
            <div
                onClick={() => setTokenModalVisible(true)}
                className="token-select p-2 pr-3 flex items-center justify-between text-black cursor-pointer"
            >
                <div className="flex items-center gap-1 ">
                    <img src={selectedToken.icon} className="w-12" />
                    <div>
                        <div className="leading-none text-lg font-bold  mb-2">
                            {selectedToken.symbol}
                        </div>
                        <div className="leading-none">Balance: 1000 ETH</div>
                    </div>
                </div>

                <img src={IconToggle} className="w-3" />
            </div>
            {tokenModalVisible && (
                <TokenSelectModal
                    onChange={onChange}
                    onCancel={() => setTokenModalVisible(false)}
                />
            )}
        </div>
    );
}
