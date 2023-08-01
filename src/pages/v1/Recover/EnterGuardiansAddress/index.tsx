import React, { useState, useEffect } from "react";
import FileUploader from "@src/components/FileUploader";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import useTools from "@src/hooks/useTools";
import { useGlobalStore } from "@src/store/global";
import { RecoveryActionTypeEn, useRecoveryDispatchContext } from "@src/context/RecoveryContext";
import { nanoid } from "nanoid";
import { toast } from "material-react-toastify";
import Button from "@src/components/web/Button";
import TextButton from "@src/components/web/TextButton";
import { Box, Text, Image } from "@chakra-ui/react"
import FormInput from "@src/components/web/Form/FormInput";
import SmallFormInput from "@src/components/web/Form/SmallFormInput";
import DoubleFormInput from "@src/components/web/Form/DoubleFormInput";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import TextBody from "@src/components/web/TextBody";
import useForm from "@src/hooks/useForm";
import Icon from "@src/components/Icon";
import { nextRandomId, validateEmail } from "@src/lib/tools";
import { getLocalStorage } from "@src/lib/tools";
import MinusIcon from "@src/assets/icons/minus.svg";

const defaultGuardianIds = [nextRandomId(), nextRandomId(), nextRandomId()]

const getFieldsByGuardianIds = (ids: any) => {
  const fields = []

  for (const id of ids) {
    const addressField = `address_${id}`
    fields.push(addressField)
  }

  return fields
}

const validate = () => {
  return {}
}

const amountValidate = () => {
  return {}
}

const EnterGuardiansAddress = () => {
  const [fileValid, setFileValid] = useState(false);
  const { getJsonFromFile } = useTools();

  const { downloadJsonFile, emailJsonFile, formatGuardianFile } = useTools();
  const { guardians } = useGlobalStore();
  const [email, setEmail] = useState<string>();
  const [downloading, setDownloading] = useState(false);
  const [sending, setSending] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [guardianIds, setGuardianIds] = useState(defaultGuardianIds)
  const [fields, setFields] = useState(defaultGuardianIds)

  const stepDispatch = useStepDispatchContext();
  const recoveryDispatch = useRecoveryDispatchContext();

  const { values, errors, invalid, onChange, onBlur, showErrors } = useForm({
    fields,
    validate
  })

  const amountForm = useForm({
    fields: ['amount'],
    validate: amountValidate
  })

  useEffect(() => {
    setIsEmailValid(validateEmail(email));
  }, [email]);

  const handleDownload = async () => {
    setDownloading(true);

    const walletAddress = await getLocalStorage("walletAddress");

    const jsonToSave = formatGuardianFile(walletAddress, guardians);

    downloadJsonFile(jsonToSave);

    setDownloading(false);

    // onSave();
  };

  const handleEmailChange = (val: string) => {
    setEmail(val);
  };

  const handleSendEmail = async () => {
    if (!email) {
      return;
    }
    setSending(true);

    try {
      const walletAddress = await getLocalStorage("walletAddress");

      const jsonToSave = formatGuardianFile(walletAddress, guardians);

      const res: any = await emailJsonFile(jsonToSave, email);

      if (res.code === 200) {
        // onSave();
      }
    } catch {
      // maybe toast error message?
    } finally {
      setSending(false);
    }
  };

  const handleNext = () => {
    stepDispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: RecoverStepEn.GuardiansChecking,
    });
  };

  const handleFileParseResult = async (file?: File) => {
    if (!file) {
      return;
    }
    const fileJson: any = await getJsonFromFile(file);

    const fileGuardians = fileJson.guardians;
    // ! just simple validation for now. please DO check this
    if (Array.isArray(fileGuardians)) {
      const parsedGuardians = [];

      for (let i = 0; i < fileGuardians.length; i++) {
        const { address, name } = fileGuardians[i];

        if (!address) {
          // toast.error("Oops, something went wrong. Please check your file and try again.");
          return;
        }

        parsedGuardians.push({
          address,
          name,
          id: nanoid(),
        });
      }

      recoveryDispatch({
        type: RecoveryActionTypeEn.UpdateCachedGuardians,
        payload: JSON.parse(JSON.stringify(parsedGuardians)),
      });

      setFileValid(true);
    }
  };

  const handleDelete = () => {
    // removeGuardian(id);
  };

  const addGuardian = () => {
    const id = nextRandomId()
    const newGuardianIds = [...guardianIds, id]
    const newFields = getFieldsByGuardianIds(newGuardianIds)
    setGuardianIds(newGuardianIds)
    setFields(newFields)
  };

  const removeGuardian = (deleteId: string) => {
    if (guardianIds.length > 1) {
      const newGuardianIds = guardianIds.filter(id => id !== deleteId)
      const newFields = getFieldsByGuardianIds(newGuardianIds)
      setGuardianIds(newGuardianIds)
      setFields(newFields)
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">

      <Heading1 marginBottom="2em">
        Enter guardians’ addresses
      </Heading1>
      <Box display="flex">
        <Box width="400px" borderRight="1px solid #D7D7D7" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
          <Heading2>Option 1</Heading2>
          <Box marginBottom="0.75em">
            <TextBody fontSize="0.875em" textAlign="center">
              Due to your choice of private on-chain guardians, information must be manually entered to continue recovery.
            </TextBody>
          </Box>
          <Button onClick={handleDownload} loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }}>
            Upload file
          </Button>
        </Box>
        <Box width="400px" padding="20px" display="flex" flexDirection="column" alignItems="center" justifyContent="flex-start">
          <Heading2 marginBottom="0.75em">
            Option 2
          </Heading2>
          <Box marginBottom="0.75em">
            <TextBody fontSize="0.875em" textAlign="center">
              Enter the Ethereum wallets addresses you sat up as  guardians.
            </TextBody>
          </Box>
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
            <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em" width="100%">
              {(guardianIds).map((id: any) => (
                <Box position="relative" width="100%" key={id}>
                  <FormInput
                    placeholder="Enter guardian address"
                    value={values[`address_${id}`]}
                    onChange={onChange(`address_${id}`)}
                    errorMsg={showErrors[`address_${id}`] && errors[`address_${id}`]}
                    _styles={{ width: '100%' }}
                  />
                  <Box
                    onClick={() => removeGuardian(id)}
                    position="absolute"
                    width="40px"
                    right="-40px"
                    top="0"
                    height="100%"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    cursor="pointer"
                  >
                    <Icon src={MinusIcon} />
                  </Box>
                </Box>
              ))}
              <TextButton onClick={() => addGuardian()} color="#EC588D">
                Add More Guardian
              </TextButton>
            </Box>
            <TextBody marginTop="0.75em" marginBottom="0.75em" textAlign="center">
              Set number of guardian signatures required to recover if you lose access to your wallet. We recommend requiring at least X for safety.
            </TextBody>
            <SmallFormInput
              placeholder="Enter amount"
              value={amountForm.values.amount}
              onChange={amountForm.onChange('amount')}
              RightComponent={<Text fontWeight="bold">/ 3</Text>}
              _styles={{ width: '180px', marginTop: '0.75em' }}
            />
          </Box>
          <Button loading={downloading} _styles={{ width: '100%', marginTop: '0.75em' }} onClick={handleNext}>
            Next
          </Button>
        </Box>
      </Box>
    </Box>
  )
};

export default EnterGuardiansAddress;
