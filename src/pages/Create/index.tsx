import PasswordSetting from "@src/pages/Create/Steps/PasswordSetting";
import { CreateStepEn, StepContextProvider, useStepContext } from "@src/context/StepContext";
import React, { useMemo } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import GuardiansSetting from "../Create/Steps/GuardiansSetting";
import GuardiansSaving from "../Create/Steps/GuardiansSaving";
import ProgressNavBar from "@src/components/ProgressNavBar";
import DefaultSetting from "../Create/Steps/DefaultSetting";
import Completion from "../Create/Steps/Completion";

type StepNodeInfo = {
    title: string;
    element: JSX.Element;
};

const StepComponent = () => {
    const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
        return {
            [CreateStepEn.CreatePWD]: {
                title: "Get Started",
                element: <PasswordSetting />,
            },
            [CreateStepEn.SetupGuardians]: {
                title: "Set up Guardians",
                element: <GuardiansSetting />,
            },
            [CreateStepEn.SaveGuardianList]: {
                title: "Save Guardian List",
                element: <GuardiansSaving />,
            },
            [CreateStepEn.SetSoulWalletAsDefault]: {
                title: "Set as default plugin wallet",
                element: <DefaultSetting />,
            },
            [CreateStepEn.Completed]: {
                title: "Congratulation! Your Soul Wallet is created.",
                element: <Completion />,
            },
        };
    }, []);

    const {
        step: { current },
    } = useStepContext();

    return (
        <div>
            <ProgressNavBar title={stepNodeMap[current].title} maxStep={CreateStepEn.Completed} />
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
