import React, { useEffect, useState } from "react";
import InputWrapper from "../InputWrapper";
import MinusIcon from "@src/assets/icons/minus.svg";
import PlusIcon from "@src/assets/icons/plus.svg";
import Icon from "../Icon";
import { GuardianItem } from "@src/lib/type";
import { useGuardianContext } from "@src/context/hooks/useGuardianContext";

type IProps = GuardianItem;

enum OperationType {
    Create = 1,
    Delete,
}

const OperationTypeIconMap = {
    [OperationType.Create]: PlusIcon,
    [OperationType.Delete]: MinusIcon,
};

export default function GuardianInput({ id, name, address }: IProps) {
    // TODO: auto selectors?
    const { guardians, addGuardian, removeGuardian, updateAddressByIndex, updateNameByIndex } = useGuardianContext(
        (s) => s,
    );

    const [operationType, setOperationType] = useState<OperationType>(OperationType.Create);

    const handleNameChange = (value: string) => {
        updateNameByIndex(id, value);
    };
    const handleAddressChange = (value: string) => {
        updateAddressByIndex(id, value);
    };

    const handleChangeGuardianSize = () => {
        switch (operationType) {
            case OperationType.Create:
                addGuardian();
                break;
            case OperationType.Delete:
                removeGuardian(id);
                break;
            default:
                return;
        }
    };

    useEffect(() => {
        const maxIndex = guardians.length - 1;

        // TODO: MAX and MIN check?
        if (id === guardians[maxIndex].id) {
            setOperationType(OperationType.Create);
        } else {
            setOperationType(OperationType.Delete);
        }
    }, [id, guardians]);

    // TODO: address input width better larger than 468
    return (
        <div className="flex flex-row items-center">
            <div className="bg-[#F3F3F3] rounded-16 px-24 py-16 text-sm w-543  flex flex-row gap-12 mr-7">
                <InputWrapper value={name} size="s" className="w-124" label="Name" onChange={handleNameChange} />
                <InputWrapper
                    value={address}
                    size="s"
                    className="w-368"
                    label="Address"
                    onChange={handleAddressChange}
                />
            </div>

            <Icon
                src={OperationTypeIconMap[operationType]}
                className="cursor-pointer"
                onClick={handleChangeGuardianSize}
            />
        </div>
    );
}
