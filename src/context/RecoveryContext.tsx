import { GuardianItem } from "@src/lib/type";
import React, { createContext, Dispatch, ReactNode, useContext, useReducer } from "react";

export enum RecoveryActionTypeEn {
    UpdateCachedGuardians = "updateCacheGuardians",
}

interface IRecoveryAction {
    type: RecoveryActionTypeEn;
    payload: GuardianItem[];
}

interface IRecoveryContext {
    cachedGuardians?: GuardianItem[];
}

const RecoveryContext = createContext<IRecoveryContext>({});

const RecoveryDispatchContext = createContext<Dispatch<IRecoveryAction>>(() => void 0);

const recoveryReducer: (prevState: IRecoveryContext, action: IRecoveryAction) => IRecoveryContext = (
    _,
    action: IRecoveryAction,
) => {
    const { type, payload } = action;

    switch (type) {
        case RecoveryActionTypeEn.UpdateCachedGuardians: {
            return {
                cachedGuardians: payload,
            };
        }
        default: {
            throw Error("recoveryReducer: Unknown action - " + action.type);
        }
    }
};

export const RecoveryContextProvider = ({ children }: { children: ReactNode }) => {
    const [value, dispatch] = useReducer(recoveryReducer, {});

    return (
        <RecoveryContext.Provider value={{ ...value }}>
            <RecoveryDispatchContext.Provider value={dispatch}>{children}</RecoveryDispatchContext.Provider>
        </RecoveryContext.Provider>
    );
};

export const useRecoveryContext = () => useContext(RecoveryContext);
export const useRecoveryDispatchContext = () => useContext(RecoveryDispatchContext);
