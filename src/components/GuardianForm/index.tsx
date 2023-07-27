import React, { forwardRef, useImperativeHandle, useRef } from "react";
import GuardianInput from "./GuardianInput";
import { ethers } from "ethers";
import { GuardianContext, useGuardianContext } from "@src/context/hooks/useGuardianContext";
import { GuardianItem } from "@src/lib/type";
import { GuardianState, createGuardianStore } from "@src/store/guardian";
import Icon from "../Icon";
import InputWrapper from "../InputWrapper";
import SmallFormInput from "@src/components/web/Form/SmallFormInput";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text } from "@chakra-ui/react"

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
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
        {guardians.map((item) => (
          <GuardianInput key={item.id} {...item} />
        ))}
        <TextButton onClick={handleAddGuardian} color="#EC588D">
          Add More Guardian
        </TextButton>
      </Box>
      <Text fontSize="0.875em" lineHeight="1.25em" textAlign="center" marginTop="0.75em">
        Set number of guardian signatures required to recover if you lose access to your wallet. We recommend requiring at least X for safety.
      </Text>
      <SmallFormInput
        placeholder="Enter amount"
        onChange={() => {}}
        RightComponent={<Text fontWeight="bold">/3</Text>}
        _styles={{ width: '180px', marginTop: '0.75em' }}
      />
    </Box>
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
