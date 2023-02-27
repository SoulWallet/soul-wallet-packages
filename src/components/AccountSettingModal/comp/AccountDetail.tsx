import React from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";

interface IAccountDetail {
    onChange: (index: number) => void;
}

export default function AccountDetail({}: IAccountDetail) {
    const { account } = useWalletContext();

    return (
        <div className="py-3 px-4 flex flex-col break-words">
            <div>
                <div className="font-semibold mb-1">EOA</div>
                <div>{account}</div>
            </div>
        </div>
    );
}
