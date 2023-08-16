import { GuardiansStepEn, StepContextProvider, useStepContext } from "@src/context/StepContext";
import React, { ReactNode, useMemo } from "react";
import { EnHandleMode } from '@src/lib/type'
import FullscreenContainer from "@src/components/FullscreenContainer";
import EditGuardians from "@src/pages/v1/Guardians/EditGuardians";
import SetGuardians from "@src/pages/v1/Guardians/SetGuardians";
import SaveGuardians from "@src/pages/v1/Guardians/SaveGuardians";

type StepNodeInfo = {
  title: string;
  element: ReactNode;
  hint?: ReactNode;
};

const StepComponent = () => {
  const stepNodeMap: Record<number, StepNodeInfo> = useMemo(() => {
    return {
      [GuardiansStepEn.Edit]: {
        title: "Get Started",
        element: <EditGuardians />,
      },
      [GuardiansStepEn.Save]: {
        title: "Get Started",
        element: <SaveGuardians />,
      }
    };
  }, []);

  const {
    step: { current },
  } = useStepContext();

  return (
    <div>
      {stepNodeMap[current].element}
    </div>
  );
};

export default function EditGuardiansPage() {
  return (
    <FullscreenContainer>
      <StepContextProvider>
        <StepComponent />
      </StepContextProvider>
    </FullscreenContainer>
  );
}
