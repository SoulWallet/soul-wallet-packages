import Launch from "@src/pages/Start/Steps/Launch";
import PasswordSetting from "@src/pages/Start/Steps/PasswordSetting";
import { CreateStepEn, StepContextProvider, useStepContext } from "@src/context/StepContext";
import React, { useMemo } from "react";
import FullscreenContainer from "@src/components/FullscreenContainer";
import GuardiansSetting from "./Steps/GuardiansSetting";
import GuardiansSaving from "./Steps/GuardiansSaving";
import ProgressNavBar from "@src/components/ProgressNavBar";
import DefaultSetting from "./Steps/DefaultSetting";
import Completion from "./Steps/Completion";

type StepNodeInfo = {
    title: string;
    element: JSX.Element;
};

const StepComponent = () => {
    const stepNodeMap: Record<CreateStepEn, StepNodeInfo> = useMemo(() => {
        return {
            [CreateStepEn.Before]: { title: "", element: <Launch /> },
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
        <div className="border-white rounded-24 progress-window-shadow px-16 pt-16">
            {current !== CreateStepEn.Before ? (
                <ProgressNavBar
                    title={stepNodeMap[current].title}
                    percentage={Math.round((100 * current) / CreateStepEn.Completed)}
                />
            ) : null}
            {stepNodeMap[current].element}
        </div>
    );
};

export default function StartPage() {
    return (
        <FullscreenContainer>
            <StepContextProvider>
                <StepComponent />
            </StepContextProvider>
        </FullscreenContainer>
    );
}
