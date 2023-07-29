import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

export enum CreateStepEn {
    CreatePWD,
    SetupGuardians,
    SaveGuardianList,
    SetSoulWalletAsDefault,
    Completed,
}

export enum RecoverStepEn {
  Start,
  ResetPassword,
  GuardiansImporting,
  GuardiansChecking,
  SignaturePending,
  RecoverInProgress,
  Completed,
}

export enum GuardiansStepEn {
  Edit,
  Set,
  Save,
}

type StepEn = CreateStepEn | RecoverStepEn | GuardiansStepEn;

export enum StepActionTypeEn {
  JumpToTargetStep = "JumpToTargetStep",
}

interface IStepAction {
  type: StepActionTypeEn;
  payload: StepEn;
}

type StepState = {
  current: CreateStepEn | RecoverStepEn | GuardiansStepEn;
  previous?: StepEn;
};

interface IStepContext {
  step: StepState;
}

const StepContext = createContext<IStepContext>({
  step: { current: CreateStepEn.CreatePWD },
});

const StepDispatchContext = createContext<Dispatch<IStepAction>>((value: IStepAction) => void 0);

const stepReducer: (prevStepState: StepState, action: IStepAction) => StepState = (
  prevStepState: StepState,
  action: IStepAction,
) => {
  const { type, payload } = action;

  switch (type) {
    case StepActionTypeEn.JumpToTargetStep: {
      return {
        previous: prevStepState.current,
        current: payload,
      };
    }
    default: {
      throw Error("StepReducer: Unknown action - " + action.type);
    }
  }
};

export const StepContextProvider = ({ children }: { children: ReactNode }) => {
  const [step, dispatch] = useReducer(stepReducer, {
    current: 0, // both 0 to start
  });

  return (
    <StepContext.Provider value={{ step }}>
      <StepDispatchContext.Provider value={dispatch}>{children}</StepDispatchContext.Provider>
    </StepContext.Provider>
  );
};

export const useStepContext = () => useContext(StepContext);
export const useStepDispatchContext = () => useContext(StepDispatchContext);
