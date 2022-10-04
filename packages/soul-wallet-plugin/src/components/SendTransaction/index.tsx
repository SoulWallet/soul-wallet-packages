import React, { useState, useEffect } from "react";
import KeyStore from "@src/lib/keystore";
import AddressIcon from "../AddressIcon";
import Button from "../Button";

const keyStore = KeyStore.getInstance();

export default function SendTransaction() {
    const [account, setAccount] = useState<string>("");
    const doSignTransaction = async () => {
        // window.close();
       
    };

    const getAccount = async () => {
        setAccount(await keyStore.getAddress());
    };

    useEffect(() => {
        getAccount();
    }, []);

    return (
        <div className="flex flex-col justify-between h-full p-6">
            <div>
                <div className="page-title mb-10">Signature Request</div>
                <div className="mb-6">
                    <div className="mb-4">Account</div>
                    <div className="flex gap-2 items-center">
                        <AddressIcon width={48} address={account} />
                        <div>
                            <div className="font-bold text-lg font-sans">
                                {account.slice(0, 6)}...{account.slice(-6)}
                            </div>
                            <div>Balance: 123 ETH</div>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="mb-2">Origin</div>
                    <div className="font-bold text-lg">
                        https://soul.wallet.app
                    </div>
                </div>
                <div>
                    <div className="mb-2">Message</div>
                    <div className="font-bold bg-gray40 p-3 rounded-lg">
                        You are signing...
                    </div>
                </div>
            </div>

            <Button classNames="btn-blue" onClick={() => doSignTransaction()}>
                Sign
            </Button>
        </div>
    );
}
