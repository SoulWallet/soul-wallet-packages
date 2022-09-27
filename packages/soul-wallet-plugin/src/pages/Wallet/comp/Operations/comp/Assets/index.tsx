import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import IconChevronRight from "@src/assets/chevron-right.svg";
import useErc20Contract from "@src/contract/useErc20Contract";
import config from "@src/config";

export default function Assets() {
    const { getEthBalance } = useWalletContext();
    const [balanceMapping, setBalanceMapping] = useState<any>({});
    const erc20Contract = useErc20Contract();

    const getBalances = async () => {
        config.assetsList.forEach(async (item) => {
            // fix getBalance
            let balance: string = "0";
            if (item.symbol === "ETH") {
                balance = await getEthBalance();
            } else {
                balance = await erc20Contract.balanceOf(item.address);
            }

            setBalanceMapping((prev: any) => {
                return {
                    ...prev,
                    [item.address]: balance,
                };
            });
        });
    };

    useEffect(() => {
        getBalances();
    }, []);

    return (
        <div>
            {config.assetsList.map((item) => (
                <Link to={`/send/${item.address}`}
                    key={item.symbol}
                    className="flex items-center justify-between py-5 px-3 cursor-pointer hover:bg-gray-100"
                >
                    <div className="flex items-center gap-2">
                        <img src={item.icon} className="w-10" />
                        <div className="text-sm flex items-center gap-1">
                            <span>{balanceMapping[item.address] || 0}</span>
                            <span>{item.symbol}</span>
                        </div>
                    </div>

                    <img src={IconChevronRight} />
                </Link>
            ))}
        </div>
    );
}
