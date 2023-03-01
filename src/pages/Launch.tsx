import Button from "@src/components/Button";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ModalV2 from "@src/components/ModalV2";
import Statement, { AUTHORIZED_STORAGE_KEY } from "@src/components/Statement";
import { StepActionTypeEn, useStepDispatchContext, CreateStepEn, RecoverStepEn } from "@src/context/StepContext";
import useBrowser from "@src/hooks/useBrowser";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import classNames from "classnames";
import React, { useEffect, useState } from "react";

export default function Launch() {
    const [authorized, setAuthorized] = useState(false);
    const dispatch = useStepDispatchContext();
    const { goWebsite } = useBrowser();
    const [showModal, setShowModal] = useState(false);

    const getAuthorized = async () => {
        const authorizedStatus = (await getLocalStorage(AUTHORIZED_STORAGE_KEY)) ?? false;
        setAuthorized(authorizedStatus);
        setShowModal(!authorizedStatus);
    };

    useEffect(() => {
        getAuthorized();
    }, []);

    const handleOpenModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const handleAuthorize = () => {
        setLocalStorage(AUTHORIZED_STORAGE_KEY, true);
        setAuthorized(true);
        handleCloseModal();
    };

    const handleJumpToTargetStep = (targetStep: number) => {
        dispatch({
            type: StepActionTypeEn.JumpToTargetStep,
            payload: targetStep,
        });
    };

    return (
        <FullscreenContainer>
            <div className="w-[460px] flex flex-col justify-center items-center px-12 py-10">
                <Button
                    disabled={!authorized}
                    href="/popup.html#/create?mode=web"
                    className="w-full btn btn-purple btn-purple-primary"
                    onClick={() => authorized && handleJumpToTargetStep(CreateStepEn.CreatePWD)}
                >
                    Create Wallet
                </Button>

                <Button
                    href="/popup.html#/create?mode=web"
                    disabled={!authorized}
                    className="btn w-full btn-purple mt-5 mb-4 cursor-not-allowed"
                    onClick={() => authorized && handleJumpToTargetStep(RecoverStepEn.ResetPassword)}
                >
                    Import Wallet
                </Button>

                <div className="text-gray70">
                    Lost your wallet?
                    <span
                        className={classNames(
                            "font-bold text-purple ml-1",
                            authorized ? "cursor-pointer" : "cursor-not-allowed opacity-70",
                        )}
                        onClick={() => {
                            goWebsite("/recover");
                            handleJumpToTargetStep(RecoverStepEn.ResetPassword);
                        }}
                    >
                        Recover it here
                    </span>
                </div>

                <span
                    className="text-gray70 text-xs cursor-pointer underline underline-offset-4  mt-4"
                    onClick={handleOpenModal}
                >
                    Risk Disclosure Statement
                </span>
            </div>

            {/* Risk Disclosure Statement Modal */}
            <ModalV2 visible={showModal} className="bg-white min-w-[800px]">
                <div className="flex flex-col items-center gap-4 px-2">
                    <Statement />
                    {!authorized ? (
                        <>
                            <Button onClick={handleAuthorize} type="primary" className="w-base">
                                I Understand
                            </Button>
                            <a className="skip-text mb-2" onClick={handleCloseModal}>
                                No, thanks
                            </a>
                        </>
                    ) : (
                        <span onClick={handleCloseModal} className="cursor-pointer">
                            Thank you for your agreement.
                        </span>
                    )}
                </div>
            </ModalV2>
        </FullscreenContainer>
    );
}
