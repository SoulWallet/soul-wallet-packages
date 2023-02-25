import React, { forwardRef, useImperativeHandle, useRef } from "react";
import GuardianInput from "./GuardianInput";
import { GuardianContext, useGuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianItem } from "@src/lib/type";
import { GuardianState, createGuardianStore } from "@src/store/guardian";

export interface IGuardianFormHandler {
    submit: () => Promise<GuardianItem[]>;
}

const GuardianFormInner = forwardRef((_, ref: React.Ref<IGuardianFormHandler>) => {
    const guardians = useGuardianContext((s) => s.guardians);
    const updateErrorMsgById = useGuardianContext((s) => s.updateErrorMsgById);

    const handleSubmit: () => Promise<GuardianItem[]> = () =>
        new Promise((resolve, reject) => {
            const addressList: string[] = [];

            for (let i = 0; i < guardians.length; i++) {
                if (guardians[i].address.length && addressList.includes(guardians[i].address)) {
                    updateErrorMsgById(guardians[i].id, "Duplicate address");
                    return reject();
                }
                addressList.push(guardians[i].address);
            }

            return resolve(guardians);
        });

    useImperativeHandle(ref, () => {
        return {
            submit: handleSubmit,
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
                return innerRef.current?.submit() ?? Promise.reject();
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
