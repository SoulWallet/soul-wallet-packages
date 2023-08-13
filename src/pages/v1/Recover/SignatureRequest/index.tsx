import GuardianForm, { IGuardianFormHandler } from "@src/components/GuardianForm";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState, useEffect } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
import ModalV2 from "@src/components/ModalV2";
import useWallet from "@src/hooks/useWallet";
import { useRecoveryContext } from "@src/context/RecoveryContext";
import { GuardianItem } from "@src/lib/type";
import { notify } from "@src/lib/tools";
import { Box, Text, Image, useToast } from "@chakra-ui/react"
import Button from "@src/components/web/Button";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";
import CopyIcon from "@src/components/Icons/Copy";
import CheckedIcon from "@src/components/Icons/Checked";
import ErrorIcon from "@src/components/Icons/Error";
import useTools from "@src/hooks/useTools";
import { useGuardianStore } from "@src/store/guardian";
import useWalletContext from "@src/context/hooks/useWalletContext";
import api from "@src/lib/api";
import config from "@src/config";
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@src/lib/tools'

const GuardiansChecking = () => {
  const [recoverStatus, setRecoverStatus] = useState(0)
  const [chainStatusList, setChainStatusList] = useState([])
  const [loading, setLoading] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { generateQrCode } = useTools();
  const { guardians, threshold, slot, slotInitInfo, recoverRecordId, guardianSignatures, setGuardianSignatures, resetGuardians } = useGuardianStore();
  // const { initRecoverWallet } = useWallet();
  const toast = useToast()
  const { account, getAccount, replaceAddress } = useWalletContext()
  const formRef = useRef<IGuardianFormHandler>(null);
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);

  const { cachedGuardians } = useRecoveryContext();
  const dispatch = useStepDispatchContext();
  const handleCheckGuardianAddresses = () => {
    // TODO: here
    // // 👇 mock logic, delete it
    // setShowVerificationModal(true);
    // setTimeout(() => {
    //     setShowVerificationModal(false);
    // }, 3000);
    // ! if check pass, then submit guardians to the global store
    // formRef.current?.submit();
    // TODO: once the guardians are submitted, clear the temporary guardians
  };

  const doCopy = () => {
    copyText(recoverRecordId)
    toast({
      title: "Copy success!",
      status: "success",
    });
  };

  const generateQR = async (text: string) => {
    try {
      setImgSrc(await generateQrCode(text));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    generateQR(recoverRecordId)
  }, []);

  const getRecoverRecord = async () => {
    const result = await api.guardian.getRecoverRecord({ recoveryRecordID: recoverRecordId })
    console.log('guardianSignatures', result)
    const guardianSignatures = result.data.guardianSignatures
    setGuardianSignatures(guardianSignatures)
    const status = result.data.status
    setRecoverStatus(status)
    const statusList = result.data.statusData.chainRecoveryStatus
    setChainStatusList(statusList)

    console.log('recoveryRecordID', result, guardianSignatures)

    /* if (status === 4) {
     *   dispatch({
     *     type: StepActionTypeEn.JumpToTargetStep,
     *     payload: RecoverStepEn.SignaturePending,
     *   });
     * } */
  }

  useEffect(() => {
    getRecoverRecord()

    setInterval(async () => {
      getRecoverRecord()
    }, 5000)
  }, []);

  const handleAskSignature = async () => {
    handleCheckGuardianAddresses();
    try {
      setLoading(true)
      const guardians = (await formRef.current?.submit()) as GuardianItem[];
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.SignaturePending,
      });
    } catch (error) {
      notify("Error", "Failed to init recover request")
      console.error(error);
    }finally{
      setLoading(false)
    }
  };

  const handleNext = async () => {
    if (recoverStatus === 1) {
      window.open(`${config.officialWebUrl}/pay-recover/${recoverRecordId}`, '_blank')
    } else {
      window.open(`${config.officialWebUrl}/recover/${recoverRecordId}`, '_blank')
    }
  }

  const replaceWallet = async () => {
    getAccount()
    resetGuardians()
    replaceAddress()
  }

  console.log('account111', account, recoverStatus)

  if (recoverStatus === 4) {
    return (
      <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
        <Heading1 _styles={{ marginBottom: '20px' }}>Recover wallet success</Heading1>
        <Button
          disabled={false}
          onClick={replaceWallet}
          _styles={{ width: '100%' }}
        >
          Replace Wallet
        </Button>
      </Box>
    )
  }

  if (recoverStatus > 0) {
    return (
      <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginBottom="20px">
        <Heading1 _styles={{ marginBottom: "0.75em" }}>Recovery in progress</Heading1>
        <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
          <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">Your Keystore</Box>
            {recoverStatus >= 3 && <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
              {getKeystoreStatus(recoverStatus)}
              <Text marginLeft="4px"><CheckedIcon /></Text>
            </Box>}
            {recoverStatus < 3 && <Box fontSize="14px" fontWeight="bold" color="#848488" display="flex" alignItems="center" justifyContent="center">
              {getKeystoreStatus(recoverStatus)}
            </Box>}
          </Box>
        </Box>
        <Box marginTop="2em" marginBottom="2em">
          <TextBody textAlign="center">
            Estimated time until your Layer2 wallets are recovered: 12:56:73
          </TextBody>
        </Box>
        <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
          {chainStatusList.map((item: any) =>
            <Box key={item.chainId} display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
              <Box fontSize="14px" fontWeight="bold">Your {getNetwork(item.chainId)} wallet(s)</Box>
              <Box fontSize="14px" fontWeight="bold" color="#848488">{getStatus(item.status)}</Box>
            </Box>
          )}
        </Box>
        <Button
          disabled={false}
          onClick={handleNext}
          _styles={{ width: '100%' }}
        >
          Share Pay Link
        </Button>
      </Box>
    )
  }

  return (
    <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
      <Heading1>Guardian signature request</Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Share this link with your guardians to sign.
        </TextBody>
      </Box>
      <Box
        marginBottom="0.75em"
        background="white"
        borderRadius="1em"
        width="100%"
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Text fontSize="0.875em" fontWeight="bold" marginBottom="0.75em" cursor="pointer" display="flex" alignItems="center" justifyContent="center" onClick={doCopy}>Copy to Clickboard
          <Text marginLeft="4px"><CopyIcon /></Text>
        </Text>
        <Box width="150px" height="150px">
          <Image src={imgSrc} width="150px" height="150px" />
        </Box>
      </Box>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Waiting for signatures ({threshold} of {guardians.length} complete)
        </TextBody>
      </Box>
      <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
        {(guardianSignatures || []).map((item: any) =>
          <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">{toShortAddress(item.guardian)}</Box>
            {item.valid && (
              <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
                Signed
                <Text marginLeft="4px"><CheckedIcon /></Text>
              </Box>
            )}
            {!item.valid && (
              <Box fontSize="14px" fontWeight="bold" color="#E83D26" display="flex" alignItems="center" justifyContent="center">
                Error
                <Text marginLeft="4px"><ErrorIcon /></Text>
              </Box>
            )}
          </Box>
        )}

        {/* <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
            <Box fontSize="14px" fontWeight="bold" color="#848488">Waiting</Box>
            </Box>
            <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
            <Box fontSize="14px" fontWeight="bold" color="#E83D26" display="flex" alignItems="center" justifyContent="center">
            Error
            <Text marginLeft="4px"><ErrorIcon /></Text>
            </Box>
            </Box>
            <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
            <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
            Signed
            <Text marginLeft="4px"><CheckedIcon /></Text>
            </Box>
            </Box>
            <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">0xFDF7...7890</Box>
            <Box fontSize="14px" fontWeight="bold" color="#848488">Waiting</Box>
            </Box> */}
      </Box>
      <Button
        disabled={false}
        onClick={handleNext}
        _styles={{ width: '100%' }}
      >
        Next
      </Button>
    </Box>
  )
};

export default GuardiansChecking;
