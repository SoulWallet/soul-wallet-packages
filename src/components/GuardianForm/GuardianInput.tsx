import React from "react";
import InputWrapper from "../InputWrapper";
import MinusIcon from "@src/assets/icons/minus.svg";
import Icon from "../Icon";
import { GuardianItem } from "@src/lib/type";
import { useGuardianContext } from "@src/context/hooks/useGuardianContext";

type IProps = GuardianItem;

export default function GuardianInput({ id, name, address, errorMsg, inputClassName }: IProps) {
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
      <div className="bg-[#F3F3F3] rounded-2xl text-sm flex flex-row w-full">
        <InputWrapper
          placeholder="Enter guardian address"
          value={address}
          size="s"
          className="address-input-wrapper"
          inputClassName="address-input"
          label=""
          onChange={handleAddressChange}
          errorMsg={errorMsg}
        />
        <InputWrapper
          placeholder="Assign nickname"
          value={name}
          size="s"
          className="name-input-wrapper"
          inputClassName="name-input"
          label=""
          onChange={handleNameChange}
        />
      </div>

      {/* <Icon src={MinusIcon} className="cursor-pointer" onClick={handleDelete} /> */}
    </div>
  );
}
