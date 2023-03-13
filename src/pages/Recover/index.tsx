import {
    RecoverStepEn,
    StepContextProvider,
    useStepContext,
    StepActionTypeEn,
    useStepDispatchContext,
} from "@src/context/StepContext";
import React, { useEffect, useMemo, useState } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ProgressNavBar from "@src/components/ProgressNavBar";
import RecoverStarter from "./Steps/RecoverStarter";
import PasswordResetting from "./Steps/PasswordResetting";
import SignaturePending from "./Steps/SignaturePending";
import GuardiansChecking from "./Steps/GuardiansChecking";
import GuardiansImporting from "./Steps/GuardiansImporting";
import { getLocalStorage, setLocalStorage } from "@src/lib/tools";
import { RecoveryContextProvider } from "@src/context/RecoveryContext";
import StepCompletion from "@src/components/StepCompletion";

type StepNodeInfo = {
    title: string;
    element: JSX.Element;
};

const StepComponent = () => {
    const dispatch = useStepDispatchContext();

    const [walletAddress, setWalletAddress] = useState("");
    const [payToken, setPayToken] = useState("");
    const [recoverStatus, setRecoverStatus] = useState("n/m");

    const onRecoverSubmit = async (wAddress: string, pToken: string) => {
        setWalletAddress(wAddress);
        // todo, remove somewhere else
        await setLocalStorage("walletAddress", wAddress);
        setPayToken(pToken);
    };

    // TODO: guardians & signed
    const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
        return {
            [RecoverStepEn.Start]: {
                title: "Recover your wallet",
                element: <RecoverStarter onSubmit={onRecoverSubmit} />,
            },
            [RecoverStepEn.ResetPassword]: {
                title: "Set New Password",
                element: <PasswordResetting />,
            },
            [RecoverStepEn.GuardiansImporting]: {
                title: "Import Guardian Address File",
                element: <GuardiansImporting />,
            },
            [RecoverStepEn.GuardiansChecking]: {
                title: "Enter Guardian Address",
                element: <GuardiansChecking walletAddress={walletAddress} payToken={payToken} />,
            },
            // TODO: dynamic change n/m
            [RecoverStepEn.SignaturePending]: {
                title: `Waiting Signature (${recoverStatus}) `,
                element: <SignaturePending onChange={setRecoverStatus} />,
            },
            [RecoverStepEn.Completed]: {
                title: "Congratulation! Your Soul Wallet is recovered.",
                element: <StepCompletion />,
            },
        };
    }, [walletAddress, payToken, recoverStatus]);

    const {
        step: { current },
    } = useStepContext();

    const checkRecoverStatus = async () => {
        const opHash = await getLocalStorage("recoverOpHash");
        if (opHash) {
            dispatch({
                type: StepActionTypeEn.JumpToTargetStep,
                payload: RecoverStepEn.SignaturePending,
            });
        }
    };

    useEffect(() => {
        checkRecoverStatus();
    }, []);

    return (
        <div>
            <ProgressNavBar title={stepNodeMap[current].title} maxStep={RecoverStepEn.Completed} />
            {stepNodeMap[current].element}
        </div>
    );
};

export default function RecoverPage() {
    return (
        <FullscreenContainer>
            <RecoveryContextProvider>
                <StepContextProvider>
                    <StepComponent />
                </StepContextProvider>
            </RecoveryContextProvider>
        </FullscreenContainer>
    );
}
