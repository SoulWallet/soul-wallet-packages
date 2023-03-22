import React from "react";
import InputWrapper from "../InputWrapper";
import MinusIcon from "@src/assets/icons/minus.svg";
import Icon from "../Icon";
import { GuardianItem } from "@src/lib/type";
import { useGuardianContext } from "@src/context/hooks/useGuardianContext";

type IProps = GuardianItem;

export default function GuardianInput({ id, name, address, errorMsg }: IProps) {
    const { removeGuardian, updateAddressById, updateNameById, updateErrorMsgById } = useGuardianContext((s) => s);

    const handleNameChange = (value: string) => {
        updateNameById(id, value);
    };
    const handleAddressChange = (value: string) => {
        updateErrorMsgById(id);
        updateAddressById(id, value);
    };

    const handleDelete = () => {
        removeGuardian(id);
    };

    // TODO: address input width better larger than 468
    return (
        <div className="guardian-inputer">
            <div className="bg-[#F3F3F3] rounded-2xl px-6 py-4 text-sm flex flex-row gap-3 mr-2">
                <InputWrapper
                    value={name}
                    size="s"
                    className="w-sm text-sm"
                    errorMsgClassName="top-[30px] left-[14px]"
                    label="Name"
                    onChange={handleNameChange}
                />
                <InputWrapper
                    value={address}
                    size="s"
                    className="w-[268px] address"
                    label="Address"
                    onChange={handleAddressChange}
                    errorMsg={errorMsg}
                />
            </div>

            <Icon src={MinusIcon} className="cursor-pointer" onClick={handleDelete} />
        </div>
    );
}
