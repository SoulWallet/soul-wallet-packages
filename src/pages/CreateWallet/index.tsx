import React, { useState } from "react";
import { Link } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import Logo from "@src/components/Logo";
import { CreatePassword } from "@src/components/CreatePassword";

export function CreateWallet() {
    const [step, setStep] = useState<number>(0);
    const { getAccount } = useWalletContext();

    const onCreatedWalletAddress: any = async (
        address: string,
        eoaAddress: string,
    ) => {
        console.log("created ", address, eoaAddress);
        await getAccount();
        setStep(1);
    };

    return (
        <>
            <div className="p-6 h-full flex flex-col">
                <Logo />
                <div>
                    {step === 0 && (
                        <>
                            <div className="page-title mb-4">
                                Create password
                            </div>
                            <CreatePassword
                                onCreatedWalletAddress={onCreatedWalletAddress}
                                saveKey={true}
                            />
                        </>
                    )}
                    {step === 1 && (
                        <>
                            <div className="page-title mb-8">
                                Congratulations
                            </div>
                            <div className="page-desc mb-10">
                                <div className="mb-2">
                                    You have created your first wallet!
                                </div>
                                <div className="mb-2">
                                    Now you can use this wallet to receive fund.
                                </div>
                                <div className="mb-2">
                                    To unlock full feature, please deploy this
                                    wallet after you received/top up your
                                    wallet.
                                </div>
                            </div>
                            <Link to="/wallet">
                                <a className="btn btn-blue w-full">Continue</a>
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
