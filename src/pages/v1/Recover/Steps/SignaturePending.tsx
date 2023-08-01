import Icon from "@src/components/Icon";
import ModalV2 from "@src/components/ModalV2";
import closeIcon from "@src/assets/icons/close.svg";
import loadingGif from "@src/assets/skeleton_loading.gif";
import React, { useEffect, useState } from "react";
import { toast } from "material-react-toastify";
import BN from "bignumber.js";
import useErc20Contract from "@src/contract/useErc20Contract";
import config from "@src/config";
import api from "@src/lib/api";
import useWallet from "@src/hooks/useWallet";
import { getLocalStorage, notify } from "@src/lib/tools";
import { RecoverStepEn, StepActionTypeEn, useStepDispatchContext } from "@src/context/StepContext";
import ErrorBlock from "@src/components/ErrorBlock";
import { Box, Text, Image } from "@chakra-ui/react"
import Button from "@src/components/web/Button";
import Heading1 from "@src/components/web/Heading1";
import Heading2 from "@src/components/web/Heading2";
import Heading3 from "@src/components/web/Heading3";
import TextBody from "@src/components/web/TextBody";

enum SignatureStatusEn {
  Signed = 1,
  Pending = 2,
  Error = 3,
}

const SignatureStatusMap = {
  [SignatureStatusEn.Signed]: { text: "Signed", color: "text-[#1BB25D]" },
  [SignatureStatusEn.Pending]: { text: "Waiting", color: "text-[#999999]" },
  [SignatureStatusEn.Error]: { text: "Error, need to re-sign", color: "text-[#F5CC43]" },
};

interface ISignaturesItem {
  address: string;
  signature: string;
  status: SignatureStatusEn;
  _styles: any;
}

interface ISignaturePending {
  onChange: (statusText: string) => void;
}

const SignatureItem = ({ address, status }: ISignaturesItem) => (
  <div className="px-6 py-3 even:bg-[#FAFAFA]">
    <div className="flex flex-row justify-between items-center">
      <span className="text-black text-xl">Guardian</span>
      <span className={"text-base " + SignatureStatusMap[status].color}>{SignatureStatusMap[status].text}</span>
    </div>
    <p className="text-gray80 address whitespace-nowrap mt-2">{address}</p>
  </div>
);

const SignaturePending = ({ onChange }: ISignaturePending) => {
  // TODO: setHasError(true) when something wrong
  const [hasError, setHasError] = useState(false);
  const dispatch = useStepDispatchContext();
  const [loadingList, setLoadingList] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);
  // const { recoverWallet } = useWallet();
  const [signatureList, setSignatureList] = useState<any>([]);
  const [progress, setProgress] = useState(0);
  const [shareUrl, setShareUrl] = useState("");
  const [opDetail, setOpDetail] = useState<any>({});
  const [opHash, setOpHash] = useState("");
  const [recoveringWallet, setRecoveringWallet] = useState(false);
  const [recoverTokenAddress, setRecoverTokenAddress] = useState("");
  const [recoverTokenSymbol, setRecoverTokenSymbol] = useState("");
  const [needAmount, setNeedAmount] = useState("");
  const [userBalance, setUserBalance] = useState("0");
  const { balanceOf } = useErc20Contract();

  const handleOpenShareModal = () => {
    setShowShareModal(true);
  };

  const handleCloseShareModal = () => {
    setShowShareModal(false);
  };

  const doRecover = async () => {
    const finalSignatureList = signatureList.filter((item: any) => !!item.signature);
    const finalGuardianList = signatureList.map((item: any) => item.address);

    try {
      setRecoveringWallet(true);
      // await recoverWallet(opDetail, finalSignatureList, finalGuardianList, opHash);
      dispatch({
        type: StepActionTypeEn.JumpToTargetStep,
        payload: RecoverStepEn.Completed,
      });
    } catch (err) {
      notify("Error", "Failed to recover");
    } finally {
      setRecoveringWallet(false);
    }
  };

  const handleNext = async () => {
    dispatch({
      type: StepActionTypeEn.JumpToTargetStep,
      payload: RecoverStepEn.RecoverInProgress,
    })
  }

  const getList = async (opHash: string) => {
    setShareUrl(`${config.recoverUrl}/${opHash}`);
    const res: any = await api.recovery.get(opHash);
    let signedNum = 0;
    res.data.signatures.forEach((item: ISignaturesItem) => {
      // check status
      if (item.signature) {
        item.status = SignatureStatusEn.Signed;
        signedNum++;
      } else {
        item.status = SignatureStatusEn.Pending;
      }
    });
    setSignatureList(res.data.signatures);
    setProgress(Math.ceil((signedNum / res.data.signatures.length) * 100));
    onChange(`${signedNum}/${res.data.signatures.length}`);
  };

  const getDetail = async (opHash: string) => {
    const res = await api.recovery.getOp(opHash);

    const tokenInfo = config.assetsList.filter((item: any) => item.address === res.data.tokenAddress)[0];

    const { decimals } = tokenInfo;

    const amountFormatted = new BN(res.data.amountInWei).shiftedBy(-decimals).toString();

    // setNeedAmountString(`${amountFormatted} ${tokenInfo.symbol}`);
    setRecoverTokenSymbol(tokenInfo.symbol);
    setNeedAmount(amountFormatted);
    setRecoverTokenAddress(res.data.tokenAddress);

    setOpDetail(res.data.userOp);
    setOpHash(res.data.opHash);

    getUserBalance(res.data.tokenAddress);
  };

  const getInfo = async (init = false) => {
    const opHash = await getLocalStorage("recoverOpHash");
    await getList(opHash);
    if (init) {
      await getDetail(opHash);
      setLoadingList(false);
    }
  };

  const getUserBalance = async (tokenAddress: string) => {
    if (!tokenAddress) {
      return;
    }
    const res = await balanceOf(tokenAddress);
    setUserBalance(res);
  };

  useEffect(() => {
    if (!recoverTokenAddress) {
      return;
    }

    const intervalId = setInterval(() => {
      getUserBalance(recoverTokenAddress);
    }, 5000);
    return () => clearInterval(intervalId);
  }, [recoverTokenAddress]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      getInfo(false);
    }, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    getInfo(true);
  }, []);

  return (
    <Box width="400px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
      <Heading1>Pay recovery fee</Heading1>
      <Box marginBottom="0.75em">
        <TextBody textAlign="center">
          Anyone can pay the recovery fee, but it must be paid in ETH.
        </TextBody>
      </Box>
      <Box
        marginBottom="1.5em"
        background="white"
        borderRadius="1em"
        width="100%"
        padding="20px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Box width="150px" height="150px" background="grey" />
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" borderTop="1px solid #D7D7D7" width="100%" marginTop="0.75em">
          <Box display="flex" width="100%" alignItems="center" justifyContent="space-between" fontSize="0.875em" fontWeight="bold" paddingTop="4px">
            <Box>Network:</Box>
            <Box>Ethereum</Box>
          </Box>
          <Box display="flex" width="100%" alignItems="center" justifyContent="space-between" fontSize="0.875em" fontWeight="bold" paddingTop="4px">
            <Box>Network fee:</Box>
            <Box>2.22 ETH</Box>
          </Box>
        </Box>
      </Box>
      <Button
        disabled={false}
        onClick={handleNext}
        _styles={{ width: '100%' }}
      >
        Connect wallet and pay
      </Button>
      <Button
        disabled={false}
        onClick={() => {}}
        _hover={{ color: '#1E1E1E', background: 'white' }}
        _styles={{ width: '100%', marginTop: '0.75em', color: '#1E1E1E', background: 'white' }}
      >
        Share with others
      </Button>
      <Box marginTop="0.75em">
        <TextBody textAlign="center">
          Your Ethereum wallet is set for immediate recovery. All Layer2 wallets are estimated to be recovered in 12:56:73.
        </TextBody>
      </Box>
    </Box>
  )

  /* return hasError ? (
   *   <ErrorBlock onRefresh={getInfo} />
   * ) : (
   *   <div className="relative pb-100 -mx-4 bg-white">
   *     <div>
   *       {loadingList && <img src={loadingGif} className="p-6" />}
   *       {!loadingList &&
   *        signatureList.map((item: ISignaturesItem, idx: number) => <SignatureItem key={idx} {...item} />)}
   *     </div>
   *     <div className="mt-8 px-6 text-lg">
   *       This wallet address require{" "}
   *       <span className="text-[#3E58FA]">
   *         {needAmount} {recoverTokenSymbol}
   *       </span>{" "}
   *       fee to recover.
   *       <br />
   *       You current balance is{" "}
   *       <span className="text-[#3E58FA]">
   *         {userBalance} {recoverTokenSymbol}
   *       </span>
   *       .
   *     </div>
   *     <div className="bg-white relative inset-x-0 bottom-0 w-full h-[100px] flex flex-row items-center justify-evenly gap-x-5 rounded-b-md px-4">
   *       <Button className="w-[calc(50%-12px)]" onClick={handleOpenShareModal}>
   *         Share URL
   *       </Button>
   *       <Button
   *         className="w-[calc(50%-12px)]"
   *         loading={recoveringWallet}
   *         type="primary"
   *         disabled={progress < 50 || new BN(userBalance).isLessThan(needAmount)}
   *         onClick={doRecover}
   *       >
   *         Recover
   *       </Button>
   *     </div>

   *     <ModalV2 visible={showShareModal} className="bg-white text-black">
   *       <div>
   *         <div className="flex flex-row justify-between">
   *           <h1 className="font-bold text-xl">Share recovery URL to your guardians</h1>
   *           <Icon src={closeIcon} onClick={handleCloseShareModal} className="cursor-pointer" />
   *         </div>

   *         <p className="my-5">
   *           Share recovery URL to your guardiansShare this link with your guardians for them to connect
   *           wallet and sign.
   *         </p>

   *         <div className="flex flex-col">
   *           <a target="_blank" href={shareUrl} className="text-purple break-words" rel="noreferrer">
   *             {shareUrl}
   *           </a>
   *           <Button
   *             type="primary"
   *             className="mt-3"
   *             onClick={() => {
   *               navigator?.clipboard?.writeText(shareUrl).then(() => {
   *                 toast.success("Copied to clipboard");
   *               });
   *             }}
   *           >
   *             Copy Link
   *           </Button>
   *         </div>
   *       </div>
   *     </ModalV2>
   *   </div>
   * ); */
};

export default SignaturePending;
