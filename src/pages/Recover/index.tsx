import { RecoverStepEn, StepContextProvider, useStepContext } from "@src/context/StepContext";
import React, { useMemo } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ProgressNavBar from "@src/components/ProgressNavBar";
import RecoverStarter from "./Steps/RecoverStarter";
import PasswordResetting from "./Steps/PasswordResetting";
import SignaturePending from "./Steps/SignaturePending";
import GuardiansChecking from "./Steps/GuardiansChecking";
import GuardiansImporting from "./Steps/GuardiansImporting";

type StepNodeInfo = {
    title: string;
    element: JSX.Element;
};

const StepComponent = () => {
    // TODO: guardians & signed
    const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
        return {
            [RecoverStepEn.Start]: {
                title: "Recover your wallet",
                element: <RecoverStarter />,
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
                element: <GuardiansChecking />,
            },
            // TODO: dynamic change n/m
            [RecoverStepEn.SignaturePending]: {
                title: "Waiting Signature (n/m) ",
                element: <SignaturePending />,
            },
        };
    }, []);

    const {
        step: { current },
    } = useStepContext();

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
