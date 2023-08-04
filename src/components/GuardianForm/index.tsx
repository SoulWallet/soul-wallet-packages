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
import TextBody from "@src/components/web/TextBody";

export interface IGuardianFormHandler {
  submit: () => Promise<GuardianItem[]>;
  noNameInput?: boolean;
}

const GuardianFormInner = forwardRef(({ noNameInput }: { noNameInput?: boolean }, ref: React.Ref<IGuardianFormHandler>) => {
  // const guardians = useGuardianContext((s) => s.guardians);
  // const updateErrorMsgById = useGuardianContext((s) => s.updateErrorMsgById);
  // const addGuardian = useGuardianContext((s) => s.addGuardian);

  const handleSubmit = () => {}

  const handleAddGuardian = () => {
    // addGuardian();
  };

  /* useImperativeHandle(ref, () => {
   *   return {
   *     submit: handleSubmit,
   *   };
   * }); */

  console.log('noNameInput 1111', noNameInput)
  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em" width="100%">
        {[].map((item: any) => (
          <GuardianInput key={item.id} noNameInput={noNameInput} {...item} />
        ))}
        <TextButton onClick={handleAddGuardian} color="#EC588D">
          Add More Guardian
        </TextButton>
      </Box>
      <TextBody marginTop="0.75em" marginBottom="0.75em" textAlign="center">
        Set number of guardian signatures required to recover if you lose access to your wallet. We recommend requiring at least X for safety.
      </TextBody>
      <SmallFormInput
        placeholder="Enter amount"
        onChange={() => {}}
        RightComponent={<Text fontWeight="bold">/ 3</Text>}
        _styles={{ width: '180px', marginTop: '0.75em' }}
      />
    </Box>
  );
});
GuardianFormInner.displayName = "GuardianFormInner";

interface IGuardianFormProps {
  guardians?: GuardianItem[];
  noNameInput?: boolean;
}

const GuardianForm = ({ guardians, noNameInput }: IGuardianFormProps, ref: React.Ref<IGuardianFormHandler>) => {
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
  console.log('noNameInput 0000', noNameInput)
  return (
    <GuardianContext.Provider value={storeRef.current}>
      <GuardianFormInner ref={innerRef} noNameInput={noNameInput} />
    </GuardianContext.Provider>
  );
};

export default forwardRef(GuardianForm);
