import React, { useState, useEffect } from "react";
import Logo from "@src/components/Logo";
import BN from "bignumber.js";
import Button from "@src/components/Button";
import { Link } from "react-router-dom";
import useWallet from "@src/hooks/useWallet";
import { useNavigate } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import api from "@src/lib/api";
import { setLocalStorage, getLocalStorage, removeLocalStorage } from "@src/lib/tools";
import ImgSuccessCat from "@src/assets/success-cat.svg";
import { CreatePassword } from "@src/components/CreatePassword";
import { SendEmail } from "@src/components/SendEmail";
import config from "@src/config";

export function RecoverWallet() {
    const { account, replaceAddress } = useWalletContext();
    const { recoverWallet, deleteWallet, getRecoverId } = useWallet();
    const [progress, setProgress] = useState<number>();
    const navigate = useNavigate();
    const [cachedEmail, setCachedEmail] = useState<string>("");
    const [step, setStep] = useState<number>(0);
    const [detail, setDetail] = useState<any>({});
    const [newOwnerAddress, setNewOwnerAddress] = useState<string | null>("");
    const [recoveringWallet, setRecoveringWallet] = useState(false);

    const onCreatedEoaAddress = async (address: string | null) => {
        setNewOwnerAddress(address);
        // await setLocalStorage('newKey', address)
        setStep(1);
    };

    const onReceiveCode = async (email: string, code: string) => {
        const new_key = newOwnerAddress || (await getLocalStorage("stagingAccount"));

        // todo, get by calculating
        const walletAddress = "0x000";

        const { requestId }: any = await getRecoverId(new_key, walletAddress);

        const res: any = await api.account.recover({
            email,
            code,
            new_key,
            request_id: requestId,
        });
        if (res.code === 200) {
            await replaceAddress();
            await setLocalStorage("authorization", res.data.jwtToken);
            await setLocalStorage("recovering", true);
            await checkRecoverStatus(new_key);
            setStep(2);
        }
    };

    const doDeleteWallet = async () => {
        await deleteWallet();
        await removeLocalStorage("recovering");
        navigate("/welcome");
    };

    const checkRecoverStatus = async (newKey?: string) => {
        const _recovering = await getLocalStorage("recovering");
        const _cachedEmail = await getLocalStorage("cachedEmail");
        if (_cachedEmail) {
            setCachedEmail(_cachedEmail);
            setStep(1);
        } else if (_recovering) {
            setStep(2);
            console.log("check account", account);
            const res = await api.guardian.records({
                new_key: newKey || account,
            });

            const require = res.data.requirements;

            setProgress(new BN(require.signedNum).div(require.total).times(100).toNumber());

            setDetail(res.data);
        }
    };

    const doRecover = async () => {
        const signatures = detail.recoveryRecords.recovery_records
            .filter((item: any) => item.signature)
            .map((item: any) => item.signature);

        setRecoveringWallet(true);
        await recoverWallet(account, signatures);

        await api.account.finishRecoveryRecord({
            new_key: account,
        });

        setRecoveringWallet(true);

        await removeLocalStorage("recovering");
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
                        <CreatePassword onCreatedEoaAddress={onCreatedEoaAddress} saveKey={false} />
                        <div className="text-xs">
                            Setting a new password will delete the signing key from your current device.
                            <br />
                            <br />
                            You will be able to access the wallet after &gt;50% of your guardians sign their signatures
                            for your recovery request.
                        </div>
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
                                You can recover your wallet once more than 50% of your guardians have signed the
                                transaction in the Security Center.
                            </div>
                            <div className="flex items-center justify-center gap-6 mt-4 ">
                                <div
                                    className="radial-progress bg-primary text-primary-content border-4 border-primary"
                                    style={progressStyle}
                                >
                                    {new BN(progress || "0").integerValue().toString()}%
                                </div>
                            </div>
                            <div className="divider mt-6">Guardian Address</div>
                            <div className="mt-2 pb-24">
                                {detail.recoveryRecords &&
                                    detail.recoveryRecords.recovery_records.map((item: any) => (
                                        <div className="flex justify-between py-1" key={item.guardian_address}>
                                            <div className="font-mono">
                                                {item.guardian_address.slice(0, 6)}
                                                ...
                                                {item.guardian_address.slice(-6)}
                                            </div>
                                            {item.signature ? (
                                                <div className="text-green">Signed</div>
                                            ) : (
                                                <div className="text-blue">Pending</div>
                                            )}
                                        </div>
                                    ))}
                            </div>
                        </div>

                        <div className="fixed bottom-8 left-6 right-6">
                            {progress && progress > 50 ? (
                                <Button
                                    loading={recoveringWallet}
                                    className="btn btn-success text-white font-bold w-full"
                                    onClick={doRecover}
                                >
                                    Recover
                                </Button>
                            ) : (
                                <a href={config.safeCenterURL} target="_blank" rel="noreferrer">
                                    <a className="btn btn-blue w-full">Security Center</a>
                                </a>
                            )}
                            {/* <a onClick={doDeleteWallet}>
                                <a className="btn mt-4 w-full">Delete Wallet</a>
                            </a> */}
                        </div>
                    </>
                )}
                {step === 3 && (
                    <>
                        <img src={ImgSuccessCat} className="block mx-auto mb-12" />
                        <div className="page-title mb-3">Congratulation!</div>
                        <div className="page-desc leading-6">Your wallet is recovered!</div>
                        <div className="fixed bottom-10 left-6 right-6">
                            <Link to="/wallet" className="btn btn-blue w-full" onClick={() => setStep(3)}>
                                My Wallet
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
