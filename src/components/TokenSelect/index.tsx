import React, { useState, useEffect } from "react";
import IconToggle from "@src/assets/icons/toggle.svg";
import { ITokenSelect } from "@src/types/ITokenSelect";
import { useBalanceStore } from "@src/store/balanceStore";
import { TokenSelectModal } from "../TokenSelectModal";
import useQuery from "@src/hooks/useQuery";
import InfoTip from "../InfoTip";
import config from "@src/config";
import { ITokenItem } from "@src/lib/type";
import useWalletContext from "@src/context/hooks/useWalletContext";

export function TokenSelect({ label, labelTip, selectedAddress, onChange, ethOnly }: ITokenSelect) {
    const [tokenModalVisible, setTokenModalVisible] = useState(false);
    const { getBalances } = useQuery();
    const { walletAddress } = useWalletContext();
    const { balance } = useBalanceStore();

    const selectedToken = config.assetsList.filter((item: ITokenItem) => item.address === selectedAddress)[0];

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        getBalances();
    }, [walletAddress]);

    return (
        <div>
            <div className="mb-2 text-gray60 flex items-center gap-1">
                <span>{label}</span>
                {labelTip && <InfoTip title={labelTip} className="gas-tooltip" />}
            </div>
            <div
                onClick={() => setTokenModalVisible(true)}
                className="token-select p-2 pr-3 flex items-center justify-between text-black cursor-pointer"
            >
                <div className="flex items-center gap-1 ">
                    <img src={selectedToken.icon} className="w-12" />
                    <div>
                        <div className="leading-none text-lg font-bold  mb-2">{selectedToken.symbol}</div>
                        <div className="leading-none">
                            Balance: {balance.get(selectedToken.address)} {selectedToken.symbol}
                        </div>
                    </div>
                </div>

                <img src={IconToggle} className="w-3" />
            </div>
            {tokenModalVisible && (
                <TokenSelectModal ethOnly={ethOnly} onChange={onChange} onCancel={() => setTokenModalVisible(false)} />
            )}
        </div>
    );
}
