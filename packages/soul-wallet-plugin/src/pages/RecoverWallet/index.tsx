import React, { useState, useEffect } from "react";
import Logo from "@src/components/Logo";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import api from "@src/lib/api";
import {
    setLocalStorage,
    getLocalStorage,
    removeLocalStorage,
} from "@src/lib/tools";
import ImgSuccessCat from "@src/assets/success-cat.svg";
import { CreatePassword } from "@src/components/CreatePassword";
import { SendEmail } from "@src/components/SendEmail";
import config from "@src/config";

export function RecoverWallet() {
    const {
        account,
        replaceAddress,
        getRecoverId,
        recoverWallet,
        deleteWallet,
        walletAddress,
    } = useWalletContext();
    const [progress, setProgress] = useState<number>();
    const navigate = useNavigate();
    const [cachedEmail, setCachedEmail] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [detail, setDetail] = useState<any>({});
    const [newOwnerAddress, setNewOwnerAddress] = useState<string | null>("");

    const onCreatedEoaAddress = async (address: string | null) => {
        setNewOwnerAddress(address);
        // await setLocalStorage('newKey', address)
        setStep(1);
    };

    const onReceiveCode = async (email: string, code: string) => {
        const new_key =
            newOwnerAddress || (await getLocalStorage("stagingAccount"));
        const { requestId }: any = await getRecoverId(new_key);

        const res: any = await api.account.recover({
            email,
            code,
            new_key,
            request_id: requestId,
        });
        if (res.code === 200) {
            // replace old key
            await replaceAddress();
            await setLocalStorage("recovering", true);
            setStep(2);
        }
    };

    const doDeleteWallet = async () => {
        await deleteWallet();
        await removeLocalStorage("recovering");
        navigate("/welcome");
    };

    const checkRecoverStatus = async () => {
        const _recovering = await getLocalStorage("recovering");
        const _cachedEmail = await getLocalStorage("cachedEmail");
        if (_cachedEmail) {
            setCachedEmail(_cachedEmail);
            setStep(1);
        } else if (_recovering) {
            setStep(2);
            const res = await api.guardian.records({
                new_key: account,
            });
            console.log("recover status", res.data);
            setProgress(100);

            setDetail(res.data);

            // setProgress();
            // send api to check recover status
            // if all guardians pass, setStep(3)
            // await setLocalStorage("recovering", false);
        }
    };

    const doRecover = async () => {
        const signatures = detail.recoveryRecords.recovery_records.map(
            (item: any) => item.signature,
        );
        const res = await recoverWallet(account, signatures);
        await removeLocalStorage("recovering");
        console.log("ressssss", res);
        navigate("/wallet");
    };

    useEffect(() => {
        checkRecoverStatus();
    }, []);

    const progressStyle = {
        "--value": progress,
        "--size": "72px",
    } as React.CSSProperties;

    return (
        <>
            <div className="p-6 h-full flex flex-col">
                <Logo />
                {step === 0 && (
                    <>
                        <div className="page-title mb-4">Recover</div>
                        <CreatePassword
                            onCreatedEoaAddress={onCreatedEoaAddress}
                            saveKey={false}
                        />
                    </>
                )}

                {step === 1 && (
                    <>
                        {/** TODO, 这里邮箱是不能编辑的  */}
                        <div className="page-title mb-4">Recover</div>
                        <SendEmail
                            cachedEmail={cachedEmail}
                            source="/recover-wallet"
                            onReceiveCode={onReceiveCode}
                            emailLabel="Verify your email address to proceed"
                        />
                    </>
                )}

                {step === 2 && (
                    <>
                        <div className="page-title mb-4">Recovering</div>
                        <div className="page-desc">
                            <div>
                                Your wallet will be recovered on this device
                                once one of your guardians sign the transaction
                                on our website.
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4 ">
                                <div
                                    className="radial-progress text-primary"
                                    style={progressStyle}
                                >
                                    {progress}%
                                </div>
                                <div>Progress: 1/3</div>
                            </div>
                            <div className="divider mt-6">Guardian Address</div>
                            <div className="h-16 mt-2 overflow-scroll">
                                {[...Array(8)].map((item) => (
                                    <div>0x123123123</div>
                                ))}
                            </div>
                        </div>

                        <div className="fixed bottom-8 left-6 right-6">
                            {progress === 100 ? (
                                <a onClick={doRecover}>
                                    <a className="btn btn-blue w-full">
                                        Recover
                                    </a>
                                </a>
                            ) : (
                                <a href={config.safeCenterURL} target="_blank">
                                    <a className="btn btn-blue w-full">
                                        Go to website
                                    </a>
                                </a>
                            )}

                            <a onClick={doDeleteWallet}>
                                <a className="btn mt-4 w-full">Delete Wallet</a>
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
