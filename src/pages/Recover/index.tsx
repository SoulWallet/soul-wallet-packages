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
import { getLocalStorage } from "@src/lib/tools";

type StepNodeInfo = {
    title: string;
    element: JSX.Element;
};

const StepComponent = () => {
    const dispatch = useStepDispatchContext();

    const [walletAddress, setWalletAddress] = useState("");

    // TODO: guardians & signed
    const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
        return {
            [RecoverStepEn.Start]: {
                title: "Recover your wallet",
                element: <RecoverStarter onChange={setWalletAddress} />,
            },
            [RecoverStepEn.ResetPassword]: {
                title: "Set New Password",
                element: <PasswordResetting />,
            },
            [RecoverStepEn.GuardiansImporting]: {
                title: "Import guardians from file",
                element: <GuardiansImporting />,
            },
            [RecoverStepEn.GuardiansChecking]: {
                title: "Enter Guardians address",
                element: <GuardiansChecking walletAddress={walletAddress} />,
            },
            // TODO: dynamic change n/m
            [RecoverStepEn.SignaturePending]: {
                title: "Waiting Signature (n/m) ",
                element: <SignaturePending />,
            },
        };
    }, [walletAddress]);

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
            <ProgressNavBar title={stepNodeMap[current].title} maxStep={RecoverStepEn.SignaturePending} />
            {stepNodeMap[current].element}
        </div>
    );
};

export default function RecoverPage() {
    return (
        <FullscreenContainer>
            <StepContextProvider>
                <StepComponent />
            </StepContextProvider>
        </FullscreenContainer>
    );
}
