import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import React, { useRef, useState, useEffect } from "react";
import attentionIcon from "@src/assets/icons/attention.svg";
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
import useBrowser from "@src/hooks/useBrowser";
import { copyText, toShortAddress, getNetwork, getStatus, getKeystoreStatus } from '@src/lib/tools'

const getProgressPercent = (startTime: any, endTime: any) => {
  if (startTime && endTime) {
    const ct = Date.now()
    const st = +new Date(startTime)
    const et = +new Date(endTime)
    console.log('getProgressPercent',`${((ct - st) / (et - st)) * 100}%`)

    if (ct > et) {
      return '100%'
    } else if (ct > st && et > ct) {
      return `${((ct - st) / (et - st)) * 100}%`
    }
  }

  return '0%'
}

const GuardiansChecking = () => {
  const [loaded, setLoaded] = useState(false)
  const [replaced, setReplaced] = useState(false)
  const [recoverStatus, setRecoverStatus] = useState(0)
  const [chainStatusList, setChainStatusList] = useState([])
  const [loading, setLoading] = useState(false);
  const [showPayButton, setShowPayButton] = useState(false);
  const [imgSrc, setImgSrc] = useState<string>("");
  const { generateQrCode } = useTools();
  const {
    recoveringGuardians,
    recoveringGuardianNames,
    recoveringThreshold,
    recoverRecordId,
    recoveringSlot,
    recoveringSlotInitInfo,
    guardianSignatures,
    setGuardianSignatures,
    setRecoverRecordId,
    setGuardians,
    setGuardianNames,
    setThreshold,
    setSlot,
    setSlotInitInfo
  } = useGuardianStore();
  // const { initRecoverWallet } = useWallet();
  const toast = useToast()
  const { account, getAccount, replaceAddress } = useWalletContext()
  const [showVerificationModal, setShowVerificationModal] = useState<boolean>(false);
  const { goPlugin } = useBrowser();

  const { cachedGuardians } = useRecoveryContext();
  const dispatch = useStepDispatchContext();

  const doCopy = () => {
    copyText(`${config.officialWebUrl}/recover/${recoverRecordId}`)
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
    generateQR(`${config.officialWebUrl}/recover/${recoverRecordId}`)
  }, []);

  const getRecoverRecord = async () => {
    try {
      const result = await api.guardian.getRecoverRecord({ recoveryRecordID: recoverRecordId })
      console.log('guardianSignatures', result)
      const guardianSignatures = result.data.guardianSignatures
      setGuardianSignatures(guardianSignatures)
      const status = result.data.status
      setRecoverStatus(status)
      const statusList = result.data.statusData.chainRecoveryStatus
      setChainStatusList(statusList)
      setLoaded(true)
      console.log('recoveryRecordID', result, guardianSignatures)
    } catch (error: any) {
      console.log('error', error.message)
    }
  }

  useEffect(() => {
    getRecoverRecord()

    setInterval(async () => {
      getRecoverRecord()
    }, 5000)
  }, []);

  const handleCopy = async () => {
    let url

    if (recoverStatus === 1) {
      url = `${config.officialWebUrl}/pay-recover/${recoverRecordId}`
    } else {
      url = `${config.officialWebUrl}/recover/${recoverRecordId}`
    }

    copyText(url)

    toast({
      title: "Copy success!",
      status: "success",
    });
  }

  const handleNext = async () => {
    setShowPayButton(true)
  }

  const handlePay = async () => {
    const url = `${config.officialWebUrl}/pay-recover/${recoverRecordId}`
    window.open(url, '_blank')
  }

  const replaceWallet = async () => {
    replaceAddress()
    setRecoverRecordId(null)
    setGuardians(recoveringGuardians)
    setGuardianNames(recoveringGuardianNames)
    setThreshold(recoveringThreshold)
    // setSlot(recoveringSlot)
    // setSlotInitInfo(recoveringSlotInitInfo)
    goPlugin('wallet')
    setReplaced(true)
  }

  console.log('account111', account, recoverStatus, chainStatusList)

  if (!loaded) {
    return (
      <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
        <Box marginTop="32" marginBottom="2em">
          <Text fontSize="xl" textAlign="center" fontWeight={"600"} fontFamily={"Martian"}>
            Loading...
          </Text>
        </Box>
      </Box>
    )
  }

  if (recoverStatus === 4) {
    return (
      <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
        <Heading1 _styles={{ marginBottom: '20px' }}>Recover wallet success</Heading1>
        {replaced ? (
          <Button
            disabled={true}
            _styles={{ width: '100%' }}
          >
            Replaced
          </Button>
        ): (
          <Button
            disabled={false}
            onClick={replaceWallet}
            _styles={{ width: '100%' }}
          >
            Replace Wallet
          </Button>
        )}
      </Box>
    )
  }

  if (recoverStatus === 1) {
    return (
      <Box width="350px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" paddingBottom="20px">
        <Heading1>
          Pay recovery fee
        </Heading1>
        <Box marginBottom="0.75em">
          <TextBody textAlign="center" maxWidth="500px">
            You will be directed to a new tab for payment, please keep this page open for next step.
          </TextBody>
        </Box>
        <Button
          onClick={handlePay}
          _styles={{ width: '100%', marginTop: '0.75em' }}
        >
          Pay fee
        </Button>
      </Box>
    )
  }

  if (recoverStatus > 1) {
    return (
      <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginBottom="20px">
        <Heading1 _styles={{ marginBottom: "24px" }}>Recovery in progress</Heading1>
        <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
          <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
            <Box fontSize="14px" fontWeight="bold">Ethereum Wallet(s)</Box>
            {recoverStatus >= 3 && <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
              {getKeystoreStatus(recoverStatus)}
              <Text marginLeft="4px"><CheckedIcon /></Text>
            </Box>}
            {recoverStatus < 3 && <Box fontSize="14px" fontWeight="bold" color="#848488" display="flex" alignItems="center" justifyContent="center">
              {getKeystoreStatus(recoverStatus)}
            </Box>}
          </Box>
          {chainStatusList.map((item: any) =>
            <Box key={item.chainId} display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em" position="relative" overflow="hidden">
              {item.status === 0 && <Box position="absolute" top="0" left="0" width={getProgressPercent(item.startTime, item.expectFinishTime)} height="100%" zIndex="1" background="#1CD20F" />}
              <Box fontSize="14px" fontWeight="bold" zIndex="2">{getNetwork(Number(item.chainId))} Wallet(s)</Box>
              {item.status === 0 && <Box fontSize="14px" fontWeight="bold" color="#848488" zIndex="2">Pending</Box>}
              {item.status === 1 && <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center" zIndex="2">Recovered<Text marginLeft="4px"><CheckedIcon /></Text></Box>}
            </Box>
          )}
        </Box>
      </Box>
    )

    /* return (
     *   <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center" marginBottom="20px">
     *     <Heading1 _styles={{ marginBottom: "0.75em" }}>Recovery in progress</Heading1>
     *     <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
     *       <Box display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
     *         <Box fontSize="14px" fontWeight="bold">Your Keystore</Box>
     *         {recoverStatus >= 3 && <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">
     *           {getKeystoreStatus(recoverStatus)}
     *           <Text marginLeft="4px"><CheckedIcon /></Text>
     *         </Box>}
     *         {recoverStatus < 3 && <Box fontSize="14px" fontWeight="bold" color="#848488" display="flex" alignItems="center" justifyContent="center">
     *           {getKeystoreStatus(recoverStatus)}
     *         </Box>}
     *       </Box>
     *     </Box>
     *     <Box marginTop="2em" marginBottom="1em">
     *       <TextBody textAlign="center">
     *         L2 recover status
     *       </TextBody>
     *     </Box>
     *     <Box marginBottom="0.75em" width="100%" display="flex" flexDirection="column" alignItems="center" justifyContent="center" gap="0.75em">
     *       {chainStatusList.map((item: any) =>
     *         <Box key={item.chainId} display="flex" width="100%" background="white" height="3em" borderRadius="1em" alignItems="center" justifyContent="space-between" padding="0 1em">
     *           <Box fontSize="14px" fontWeight="bold">{getNetwork(Number(item.chainId))}</Box>
     *           {item.status === 0 && <Box fontSize="14px" fontWeight="bold" color="#848488">Pending {item.expectFinishTime && `(${new Date(item.expectFinishTime).toLocaleString()})`}</Box>}
     *           {item.status === 1 && <Box fontSize="14px" fontWeight="bold" color="#1CD20F" display="flex" alignItems="center" justifyContent="center">Recovered</Box>}
     *         </Box>
     *       )}
     *     </Box>
     *   </Box>
     * ) */
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
        <Text fontSize="16px" fontWeight="bold" marginBottom="0.75em" cursor="pointer" display="flex" alignItems="center" justifyContent="center" onClick={doCopy}>Copy to Clickboard
          <Text marginLeft="4px"><CopyIcon /></Text>
        </Text>
        <Box width="150px" height="150px">
          <Image src={imgSrc} width="150px" height="150px" />
        </Box>
      </Box>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Waiting for signatures ({recoveringThreshold} of {recoveringGuardians.length} complete)
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
      </Box>
      <Button
        disabled={false}
        onClick={handleCopy}
        _styles={{ width: '100%' }}
      >
        Next
      </Button>
    </Box>
  )
};

export default GuardiansChecking;
