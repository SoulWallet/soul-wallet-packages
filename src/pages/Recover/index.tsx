import { RecoverStepEn, StepContextProvider, useStepContext } from "@src/context/StepContext";
import React, { useMemo } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import ProgressNavBar from "@src/components/ProgressNavBar";
import RecoverStarter from "./Steps/RecoverStarter";
import PasswordResetting from "./Steps/PasswordResetting";
import GuardiansInputting from "./Steps/GuardiansInputting";

type StepNodeInfo = {
    title: string;
    element: JSX.Element;
};

const StepComponent = () => {
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
            [RecoverStepEn.GuardiansInputting]: {
                title: "Enter Guardians address",
                element: <GuardiansInputting />,
            },
            // TODO: dynamic change n/m
            [RecoverStepEn.SignaturePending]: {
                title: "Waiting Signature (1/1) ",
                element: <PasswordResetting />,
            },
        };
    }, []);

    const {
        step: { current },
    } = useStepContext();

    return (
        <div>
            <ProgressNavBar
                title={stepNodeMap[current].title}
                percentage={Math.round((100 * current) / RecoverStepEn.SignaturePending)}
            />
            {stepNodeMap[current].element}
        </div>
    );
};

export default function CreatePage() {
    return (
        <FullscreenContainer>
            <StepContextProvider>
                <StepComponent />
            </StepContextProvider>
        </FullscreenContainer>
    );
}
