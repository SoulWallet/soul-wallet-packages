import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useQuery from "@src/hooks/useQuery";
import { useBalanceStore } from "@src/store/balanceStore";
import IconChevronRight from "@src/assets/chevron-right.svg";
import { ITokenItem } from "@src/lib/type";
import config from "@src/config";

export default function Assets() {
    const { walletAddress } = useWalletContext();
    const { balance } = useBalanceStore();
    const { getBalances } = useQuery();

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        getBalances();
    }, [walletAddress]);

    return (
        <div>
            {config.assetsList.map((item: ITokenItem) => (
                <Link
                    to={`/send/${item.address}`}
                    key={item.symbol}
                    className="flex items-center justify-between py-5 px-6 cursor-pointer hover:bg-gray-100"
                >
                    <div className="flex items-center gap-2">
                        <img src={item.icon} className="w-10" />
                        <div className="text-sm flex items-center gap-1">
                            <span>{balance.get(item.address) || 0}</span>
                            <span>{item.symbol}</span>
                        </div>
                    </div>
                    <img src={IconChevronRight} />
                </Link>
            ))}
        </div>
    );
}