import React, { useState, useEffect } from "react";
import Logo from "@src/components/Logo";
import { Link } from "react-router-dom";
import api from "@src/lib/api";
import { setLocalStorage, getLocalStorage } from "@src/lib/tools";
import ImgSuccessCat from "@src/assets/success-cat.svg";
import { CreatePassword } from "@src/components/CreatePassword";
import { SendEmail } from "@src/components/SendEmail";
import config from "@src/config";

export function RecoverWallet() {
    const [step, setStep] = useState<number>(3);
    const [newOwnerAddress, setNewOwnerAddress] = useState<string | null>("");

    const onCreated = (address: string | null) => {
        setNewOwnerAddress(address);
        setStep(1);
    };

    const onReceiveCode = async (email: string, code: string) => {
        const res: any = await api.account.recover({
            email,
            code,
            new_key: newOwnerAddress,
        });
        if (res.code === 200) {
            await setLocalStorage("recovering", true);
            setStep(2);
        }
    };

    const checkRecoverStatus = async () => {
        const recovering = await getLocalStorage("recovering");

        console.log("recovering?", recovering);

        // send api to check recover status
        // if all guardians pass

        if (true) {
            await setLocalStorage("recovering", false);
            setStep(3);
        }
    };

    useEffect(() => {
        checkRecoverStatus();
    }, []);

    return (
        <>
            <div className="p-6 h-full flex flex-col">
                <Logo />
                {step === 0 && (
                    <>
                        <div className="page-title mb-4">Recover</div>
                        <CreatePassword onCreated={onCreated} />
                    </>
                )}

                {step === 1 && (
                    <>
                        {/** TODO, 这里邮箱是不能编辑的  */}
                        <div className="page-title mb-4">Recover</div>
                        <SendEmail
                            onReceiveCode={onReceiveCode}
                            emailLabel="Verify your email address to proceed"
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="page-title mb-8">Recover</div>
                        <div className="page-desc">
                            <div className="mb-5">
                                Email verification succefully.
                            </div>
                            <div>
                                Your wallet will be reocved on this device once
                                one of your guardians sign the transaction on
                                our website.
                            </div>
                        </div>
                        <div className="fixed bottom-10 left-6 right-6">
                            <a href={config.safeCenterURL} target="_blank">
                                <a className="btn btn-blue w-full">
                                    Go to website
                                </a>
                            </a>
                            <a onClick={() => setStep(2)}>
                                <a className="btn mt-4 w-full">Test success</a>
                            </a>
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <img
                            src={ImgSuccessCat}
                            className="block mx-auto mb-12"
                        />
                        <div className="page-title mb-3">Congratulation!</div>
                        <div className="page-desc leading-6">
                            Your wallet is recovered!
                        </div>
                        <div className="fixed bottom-10 left-6 right-6">
                            <Link
                                to="/wallet"
                                className="btn btn-blue w-full"
                                onClick={() => setStep(3)}
                            >
                                My Wallet
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
