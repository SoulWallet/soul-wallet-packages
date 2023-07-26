import React, { forwardRef, useImperativeHandle, useRef } from "react";
import GuardianInput from "./GuardianInput";
import { ethers } from "ethers";
import { GuardianContext, useGuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianItem } from "@src/lib/type";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import Icon from "../Icon";
import InputWrapper from "../InputWrapper";


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
      <div className="flex flex-col justify-center items-center">
        <div className="flex justify-center items-center w-full grid grid-cols-1 gap-2 min-h-fit">
          {guardians.map((item) => (
            <GuardianInput key={item.id} {...item} />
          ))}

          <div
            onClick={handleAddGuardian}
            className="guardian-inputer cursor-pointer justify-center rounded-2xl"
          >
            {/* <Icon src={PlusIcon} /> */}
            <span className="font-bold text-[#EC588D]">Add More Guardian</span>
          </div>
        </div>

        <p className="mt-4 text-sm text-black text-center">
          Set number of guardian signatures required to recover if you lose access to your wallet. We recommend requiring at least X for safety.
        </p>
        <div className="gardians-amount-container flex flex-row justify-center items-center bg-white mt-4 rounded-2xl px-2">
          <div>
            <InputWrapper
              placeholder="Enter amount"
              value={""}
              size="s"
              className="amount-input-wrapper"
              inputClassName="amount-input"
              onChange={() => {}}
              label=""
            />
          </div>
          <div className="text-base font-bold p-1">/3</div>
        </div>
        {/* <p className="mt-7 text-sm text-black">
            Any Wallet recovery requires the signature of: <span className="text-purple font-medium">{Math.ceil(guardians.length / 2)}</span> out of{" "}
            {guardians.length} guardians
            </p> */}
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
