import React, { useState, useEffect } from "react";
import api from "@src/lib/api";
import { Link } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import Logo from "@src/components/Logo";
import { SendEmail } from "@src/components/SendEmail";
import { CreatePassword } from "@src/components/CreatePassword";

export function CreateWallet() {
    const [step, setStep] = useState<number>(0);
    const [cachedEmail, setCachedEmail] = useState<string>("");
    const { getWalletAddress, getAccount } = useWalletContext();

    const [email, setEmail] = useState<string>("");

    const onReceiveCode = async (email: string, code: string) => {
        setEmail(email);
        // todo, extract ts
        const res: any = await api.account.add({
            email,
            code,
        });
        if (res.code === 200) {
            await setLocalStorage("authorization", res.data.jwtToken);
            setStep(1);
        }
    };

    const onCreatedWalletAddress: any = async (
        address: string,
        eoaAddress: string,
    ) => {
        //eoa address

        const res = await api.account.update({
            email,
            wallet_address: address,
            key: eoaAddress,
        });
        if (res) {
            // todo, this is for guardian, to be removed. removed
            // await setLocalStorage("email", email);

            // get latest wallet address
            await getAccount()

            setStep(2);
        }
    };

    const getCachedProcess = async () => {
        const storageCachedEmail = await getLocalStorage("cachedEmail");
        if (storageCachedEmail) {
            setCachedEmail(storageCachedEmail);
        }
    };

    useEffect(() => {
        getCachedProcess();
    }, []);

    return (
        <>
            <div className="p-6 h-full flex flex-col">
                <Logo />
                <div>
                    {step === 0 && (
                        <>
                            <div className="page-title mb-4">
                                Email verification
                            </div>
                            <SendEmail
                                source="/create-wallet"
                                onReceiveCode={onReceiveCode}
                                cachedEmail={cachedEmail}
                            />
                        </>
                    )}
                    {step === 1 && (
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
                    {step === 2 && (
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
