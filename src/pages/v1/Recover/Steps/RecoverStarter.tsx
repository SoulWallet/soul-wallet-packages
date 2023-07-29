import Dropdown, { OptionItem } from "@src/components/Dropdown";
import InputWrapper from "@src/components/InputWrapper";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import config from "@src/config";
import PayTokenSelect from "@src/components/PayTokenSelect";
import { getLocalStorage } from "@src/lib/tools";
import React, { useEffect, useState } from "react";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import FormInput from "@src/components/web/Form/FormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";

// TODO: here
const NetworkOptions: OptionItem[] = [
  {
    label: "Ethereum",
    value: 1,
  },
  {
    label: "Goerli",
    value: 5,
  },
  {
    label: "Arbitrum",
    value: 42161,
  },
  {
    label: "Arbitrum Goerli",
    value: 421613,
  },
];

interface IRecoverStarter {
  onSubmit: (wAddress: string, pToken: string) => void;
}

const RecoverStarter = ({ onSubmit }: IRecoverStarter) => {
  const dispatch = useStepDispatchContext();

  const [address, setAddress] = useState<string>();
  const [network, setNetwork] = useState<number>();
  const [payToken, setPayToken] = useState<string>(config.zeroAddress);

  const handleChangeAddress = (val: string) => {
    setAddress(val);
  };

  const handleChangeNetwork = (val: string | number) => {
    setNetwork(val as number);
  };

  const handleChangePayToken = (val: string | number) => {
    setPayToken(val as string);
  };

  const handleNext = () => {
    /* if (!address || !payToken) {
     *   return;
     * }
     * onSubmit(address, payToken); */
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: RecoverStepEn.ResetPassword,
    });
  };

  const getStoredWalletAddress = async () => {
    const wAddress = await getLocalStorage("walletAddress");
    if (wAddress) {
      setAddress(wAddress);
    }
  };

  useEffect(() => {
    getStoredWalletAddress();
  }, []);

  return (
    <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>
        Wallet recovery
      </Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center" maxWidth="500px">
          Enter the address of the Soul Wallet you want to recover.
        </TextBody>
      </Box>
      <FormInput
        label=""
        placeholder="Enter wallet address"
        value={''}
        errorMsg={''}
        onChange={() => {}}
        _styles={{ marginTop: '0.75em', width: '100%' }}
      />
      <Button onClick={handleNext} _styles={{ width: '100%', marginTop: '0.75em' }}>
        Next
      </Button>
    </Box>
  )

  /* return (
   *   <div className="pt-6 pb-8 flex flex-col gap-4 w-[650px]">
   *     <InputWrapper label="Enter Wallet Address" value={address} onChange={handleChangeAddress} />
   *     <PayTokenSelect value={payToken} onChange={handleChangePayToken} />
   *     <Dropdown
   *       label="Select Network"
   *       value={config.chainId}
   *       disabled={true}
   *       options={NetworkOptions}
   *       onChange={handleChangeNetwork}
   *     />
   *     <Button type="primary" disabled={!address || network === undefined} onClick={handleNext}>
   *       Next
   *     </Button>
   *   </div>
   * ); */
};

export default RecoverStarter;
