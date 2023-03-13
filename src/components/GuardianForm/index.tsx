import React, { forwardRef, useImperativeHandle, useRef } from "react";
import GuardianInput from "./GuardianInput";
import { ethers } from "ethers";
import { GuardianContext, useGuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianItem } from "@src/lib/type";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import Icon from "../Icon";
import PlusIcon from "@src/assets/icons/plus.svg";

export interface IGuardianFormHandler {
    submit: () => Promise<GuardianItem[]>;
}

const GuardianFormInner = forwardRef((_, ref: React.Ref<IGuardianFormHandler>) => {
    const guardians = useGuardianContext((s) => s.guardians);
    const updateErrorMsgById = useGuardianContext((s) => s.updateErrorMsgById);
    const addGuardian = useGuardianContext((s) => s.addGuardian);

    const handleSubmit: () => Promise<GuardianItem[]> = () =>
        new Promise((resolve, reject) => {
            const addressList: string[] = [];

            for (let i = 0; i < guardians.length; i++) {
                if (guardians[i].address.length && addressList.includes(guardians[i].address)) {
                    updateErrorMsgById(guardians[i].id, "Duplicate address");
                    return reject("Duplicate address");
                }
                if (!ethers.utils.isAddress(guardians[i].address)) {
                    updateErrorMsgById(guardians[i].id, "Invalid address");
                    return reject("Invalid address");
                }
                addressList.push(guardians[i].address);
            }

            return resolve(guardians);
        });

    const handleAddGuardian = () => {
        addGuardian();
    };

    useImperativeHandle(ref, () => {
        return {
            submit: handleSubmit,
        };
    });

    return (
        <div>
            <div className="w-full grid grid-cols-2 gap-3 min-h-fit max-h-64 overflow-y-auto min-w-[980px]">
                {guardians.map((item) => (
                    <GuardianInput key={item.id} {...item} />
                ))}

                <div
                    onClick={handleAddGuardian}
                    className="guardian-inputer mr-8 cursor-pointer justify-center bg-[#F3F3F3] rounded-2xl border border-dashed border-[#BFBFBF]"
                >
                    <Icon src={PlusIcon} />
                    <span className="ml-2 font-bold text-green">Add Guardian</span>
                </div>
            </div>

            {/* TODO: '2' here is changeable? */}
            <p className="mt-7 text-sm text-black">
                Any Wallet recovery requires the signature of: <span className="text-purple font-medium">{Math.ceil(guardians.length / 2)}</span> out of{" "}
                {guardians.length} guardians
            </p>
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
