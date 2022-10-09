import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "@src/lib/api";
import useWalletContext from "@src/context/hooks/useWalletContext";
import IconAdd from "@src/assets/add.svg";
import AddressIcon from "@src/components/AddressIcon";
import IconChevronRight from "@src/assets/chevron-right.svg";
import { getLocalStorage } from "@src/lib/tools";

export default function Guardians() {
    const { walletAddress } = useWalletContext();
    const [loading, setLoading] = useState<boolean>(false);
    const [guardiansList, setGuardiansList] = useState<[]>([]);
    const [guardianNameMapping, setGuardianNameMapping] = useState<any>({});

    const getGuardians = async () => {
        setLoading(true);
        // const email = await getLocalStorage("email");
        const res: any = await api.guardian.get({
            // email,
            wallet_address: walletAddress,
        });
        setLoading(false);
        if (res.code === 200) {
            setGuardiansList(res.data);
        }
    };

    const getGuardianNameMapping = async () => {
        const res = await getLocalStorage("guardianNameMapping");
        setGuardianNameMapping(res);
    };

    useEffect(() => {
        getGuardians();
        getGuardianNameMapping();
    }, []);

    return (
        <div className="pb-12 bg-white">
            {loading && <div className="text-center py-6">Loading...</div>}
            {!loading && (!guardiansList || guardiansList.length === 0) && (
                <div className="text-center py-6">
                    You haven't set any guardians yet.
                </div>
            )}
            {guardiansList &&
                guardiansList.map((item: string) => (
                    <Link
                        key={item}
                        to={`/guardian/${item}`}
                        className="flex items-center justify-between py-5 px-3 cursor-pointer text-base hover:bg-gray-100"
                    >
                        <div className="flex items-center gap-2">
                            <AddressIcon width={40} address={item} />

                            <div>
                                {guardianNameMapping && (
                                    <div>{guardianNameMapping[item]}</div>
                                )}
                                <div className="flex flex-col justify-between opacity-50 text-black">
                                    {item.slice(0, 4)}...
                                    {item.slice(-4)}
                                </div>
                            </div>
                        </div>

                        <img src={IconChevronRight} />
                    </Link>
                ))}

            <Link
                to="/guardian/add"
                className="absolute left-0 right-0 bottom-0 justify-center add-guardian-shadow bg-white py-3 flex gap-2 hover:bg-gray-100"
            >
                <img src={IconAdd} />
                <div className="text-blue font-semibold">Add guardians</div>
            </Link>
        </div>
    );
}
