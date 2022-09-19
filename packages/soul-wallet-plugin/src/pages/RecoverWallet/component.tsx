import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo from "@src/components/Logo";
import ImgSuccessCat from "@src/assets/success-cat.svg";
import { CreatePassword } from "@src/components/CreatePassword";
import { SendEmail } from "@src/components/SendEmail";
import config from "@src/config";

export function RecoverWallet() {
    const navigate = useNavigate();
    const [step, setStep] = useState<number>(1);

    const onReceiveCode = () => {
        setStep(1);
    };

    const onCreated = () => {
        navigate("/wallet");
    };

    return (
        <>
            <div className="p-6 h-full flex flex-col">
                <Logo />
                {step === 0 && (
                    <>
                        <div className="page-title mb-4">Recover</div>
                        <SendEmail
                            onReceiveCode={onReceiveCode}
                            emailLabel="Verify your email address to proceed"
                        />
                    </>
                )}

                {step === 1 && (
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

                {step === 2 && (
                    <>
                        <img
                            src={ImgSuccessCat}
                            className="block mx-auto mb-12"
                        />
                        <div className="page-title mb-6">Congratulation!</div>
                        <div className="page-desc leading-6">
                            Your wallet is recovered! <br />
                            Please setup the passward to proceed!
                        </div>
                        <div className="fixed bottom-10 left-6 right-6">
                            <a
                                className="btn btn-blue w-full"
                                onClick={() => setStep(3)}
                            >
                                Setup password
                            </a>
                        </div>
                    </>
                )}

                {step === 3 && <CreatePassword onCreated={onCreated} />}
            </div>
        </>
    );
}
