import React, { forwardRef, useImperativeHandle, useRef } from "react";
import GuardianInput from "./GuardianInput";
import { GuardianContext, useGuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianItem } from "@src/lib/type";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import { useGlobalStore } from "@src/store/global";

export interface IGuardianFormHandler {
    submit: () => void;
}

const GuardianFormInner = forwardRef((_, ref: React.Ref<IGuardianFormHandler>) => {
    const guardians = useGuardianContext((s) => s.guardians);
    const { updateFinalGuardians } = useGlobalStore();

    useImperativeHandle(ref, () => {
        return {
            submit: () => {
                updateFinalGuardians(guardians);
            },
        };
    });

    return (
        <div className="w-full flex flex-col gap-y-6 min-h-fit max-h-183 overflow-y-scroll ">
            {guardians.map((item) => (
                <GuardianInput key={item.id} {...item} />
            ))}
        </div>
    );
});
GuardianFormInner.displayName = "GuardianFormInner";

interface IGuardianFormProps {
    guardians?: GuardianItem[];
}

const GuardianForm = ({ guardians }: IGuardianFormProps, ref: React.Ref<IGuardianFormHandler>) => {
    const innerRef = useRef<IGuardianFormHandler>(null);
    const storeRef = useRef<GuardianState>();

    if (!storeRef.current) {
        storeRef.current = createGuardianStore(guardians ? { guardians } : undefined);
    }

    useImperativeHandle(ref, () => {
        return {
            submit: () => {
                innerRef.current?.submit();
            },
        };
    });

    return (
        <GuardianContext.Provider value={storeRef.current}>
            <GuardianFormInner ref={innerRef} />
        </GuardianContext.Provider>
    );
};

export default forwardRef(GuardianForm);
