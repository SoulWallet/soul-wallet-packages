import React, { useState, forwardRef, useImperativeHandle, useEffect, Ref } from "react";
import useQuery from "@src/hooks/useQuery";
import useTools from "@src/hooks/useTools";
import { useChainStore } from "@src/store/chain";
import api from "@src/lib/api";
import { useAddressStore } from "@src/store/address";
import { ethers } from "ethers";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import { useBalanceStore } from "@src/store/balance";
import { UserOpUtils, UserOperation } from "@soulwallet/sdk";
import useSdk from "@src/hooks/useSdk";
import BN from "bignumber.js";
import useConfig from "@src/hooks/useConfig";
import ConnectDapp from "./comp/ConnectDapp";
import SignTransaction from "./comp/SignTransaction";
import SignMessage from "./comp/SignMessage";

enum SignTypeEn {
    Transaction,
    Message,
    Account,
}

export const InfoWrap = ({ children, ...restProps }: any) => (
    <Flex fontSize="12px" fontWeight={"500"} px="4" gap="6" fontFamily={"Martian"} flexDir={"column"} {...restProps}>
        {children}
    </Flex>
);

export const InfoItem = ({ children, ...restProps }: any) => (
    <Flex align="center" justify={"space-between"} {...restProps}>
        {children}
    </Flex>
);

const SignModal = (_: unknown, ref: Ref<any>) => {
    const { selectedAddress } = useAddressStore();
    const [keepModalVisible, setKeepModalVisible] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [loadingFee, setLoadingFee] = useState(true);
    const [origin, setOrigin] = useState<string>("");
    const [promiseInfo, setPromiseInfo] = useState<any>({});
    const [decodedData, setDecodedData] = useState<any>({});
    const [signing, setSigning] = useState<boolean>(false);
    const { getTokenBalance } = useBalanceStore();
    const [prefundCalculated, setPrefundCalculated] = useState(false);
    // TODO, remember user's last select
    const [payToken, setPayToken] = useState(ethers.ZeroAddress);
    const [payTokenSymbol, setPayTokenSymbol] = useState("");
    const [feeCost, setFeeCost] = useState("");
    const [activeOperation, setActiveOperation] = useState<UserOperation>();
    const [signType, setSignType] = useState<SignTypeEn>();
    const [messageToSign, setMessageToSign] = useState("");
    const [sponsor, setSponsor] = useState<any>(null);
    const [activeTxns, setActiveTxns] = useState<any>(null); // [
    const { selectedChainId } = useChainStore();
    const { decodeCalldata } = useTools();
    const { getFeeCost, getGasPrice, getPrefund } = useQuery();
    const [sendToAddress, setSendToAddress] = useState("");
    const { chainConfig, selectedAddressItem } = useConfig();
    const { soulWallet } = useSdk();

    const formatUserOp: any = async (txns: any) => {
        try {
            const rawTxs = JSON.parse(txns);

            const { maxFeePerGas, maxPriorityFeePerGas } = await getGasPrice();

            const userOpRet = await soulWallet.fromTransaction(
                maxFeePerGas,
                maxPriorityFeePerGas,
                selectedAddress,
                rawTxs,
            );

            if (userOpRet.isErr()) {
                throw new Error(userOpRet.ERR.message);
            }

            let userOp = userOpRet.OK;

            // set preVerificationGas
            const gasLimit = await soulWallet.estimateUserOperationGas(userOp);

            if (gasLimit.isErr()) {
                throw new Error(gasLimit.ERR.message);
            }

            const feeCost = await getFeeCost(userOp, payToken);
            userOp = feeCost.userOp;

            // paymasterAndData length calc 1872 = ((236 - 2) / 2) * 16;
            userOp.preVerificationGas = `0x${BN(userOp.preVerificationGas.toString()).plus(1872).toString(16)}`;
            userOp.verificationGasLimit = `0x${BN(userOp.verificationGasLimit.toString()).plus(30000).toString(16)}`;

            return userOp;
        } catch (err) {
            console.log(err);
        }
    };

    useImperativeHandle(ref, () => ({
        async show(obj: any) {
            const { txns, actionType, origin, keepVisible, msgToSign, sendTo } = obj;
            setVisible(true);
            setOrigin(origin);

            console.log('show sign modal', txns, actionType, origin, keepVisible, msgToSign, sendTo);
            setKeepModalVisible(keepVisible || false);

            setSendToAddress(sendTo);

            if (actionType === "getAccounts") {
                setSignType(SignTypeEn.Account);
            } else if (actionType === "signMessage" || actionType === "signMessageV4") {
                setSignType(SignTypeEn.Message);
            } else {
                setSignType(SignTypeEn.Transaction);
            }

            if (txns) {
                const userOp = await formatUserOp(txns);
                setActiveTxns(txns);
                setActiveOperation(userOp);
                const callDataDecodes = await decodeCalldata(selectedChainId, chainConfig.contracts.entryPoint, userOp);
                console.log("decoded data", callDataDecodes);
                setDecodedData(callDataDecodes);
                // checkSponser(userOp);
            }

            if (msgToSign) {
                setMessageToSign(msgToSign);
            }

            return new Promise((resolve, reject) => {
                setPromiseInfo({
                    resolve,
                    reject,
                });
            });
        },
    }));

    const onReject = async () => {
        promiseInfo.reject("User reject");
        if (keepModalVisible) {
            setVisible(false);
            setSigning(false);
        } else {
            window.close();
        }
    };

    const onConfirm = async () => {
        setSigning(true);
        if (sponsor && sponsor.paymasterAndData) {
            promiseInfo.resolve({
                userOp: { ...activeOperation, paymasterAndData: sponsor.paymasterAndData },
                payToken,
            });
        } else if (payToken === ethers.ZeroAddress) {
            promiseInfo.resolve({ userOp: activeOperation, payToken });
        } else {
            promiseInfo.resolve({ userOp: activeOperation, payToken });
        }

        if (!keepModalVisible) {
            setVisible(false);
            setSigning(false);
        }
    };

    const onConnect = () => {
        promiseInfo.resolve();
    };

    const onSign = async () => {
        promiseInfo.resolve();
    };

    const checkSponser = async (userOp: UserOperation) => {
        const res = await api.sponsor.check(
            `0x${selectedChainId.toString(16)}`,
            chainConfig.contracts.entryPoint,
            UserOpUtils.userOperationFromJSON(UserOpUtils.userOperationToJSON(userOp)),
        );
        if (res.data.sponsorInfos && res.data.sponsorInfos.length > 0) {
            // TODO, check >1 sponsor
            setSponsor(res.data.sponsorInfos[0]);
        }
    };

    const getFinalPrefund = async () => {
        // IMPORTANT TODO, uncomment this to show double loading fee issue
        // setLoadingFee(true);
        // setFeeCost("");

        // TODO, extract this for other functions
        const { requiredAmount } = await getPrefund(activeOperation, payToken);

        if (ethers.ZeroAddress === payToken) {
            setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
        } else {
            setFeeCost(`${requiredAmount} USDC`);
        }
        setLoadingFee(false);
    };

    const onPayTokenChange = async () => {
        setPayTokenSymbol(getTokenBalance(payToken).symbol || "Unknown");
        const newUserOp = await formatUserOp(activeTxns);
        setActiveOperation(newUserOp);
        setPrefundCalculated(false);
        setLoadingFee(true);
    };

    useEffect(() => {
        if (!payToken || !activeTxns || !activeTxns.length) {
            return;
        }
        console.log("on pay token change", payToken, activeTxns);
        onPayTokenChange();
    }, [payToken, activeTxns]);

    useEffect(() => {
        if (!activeOperation || !payToken) {
            return;
        }
        if (prefundCalculated) {
            return;
        }
        setPrefundCalculated(true);
        getFinalPrefund();
    }, [payToken, activeOperation, prefundCalculated]);

    return (
        <div ref={ref}>
            {visible && (
                <>
                    <Box
                        h="full"
                        zIndex={"20"}
                        position={"absolute"}
                        top="0"
                        bottom={"0"}
                        left={"0"}
                        right={"0"}
                        overflow={"hidden"}
                        p="5"
                    >
                        {signType === SignTypeEn.Account && <ConnectDapp origin={origin} onConfirm={onConnect} />}
                        {signType === SignTypeEn.Transaction && (
                            <SignTransaction
                                decodedData={decodedData}
                                sendToAddress={sendToAddress}
                                sponsor={sponsor}
                                origin={origin}
                                feeCost={feeCost}
                                payToken={payToken}
                                setPayToken={setPayToken}
                                payTokenSymbol={payTokenSymbol}
                                loadingFee={loadingFee}
                                signing={signing}
                                onConfirm={onConfirm}
                            />
                        )}
                        {signType === SignTypeEn.Message && (
                            <SignMessage messageToSign={messageToSign} onSign={onSign} origin={origin} />
                        )}
                        <Text
                            color="danger"
                            fontSize="20px"
                            fontWeight={"800"}
                            textAlign={"center"}
                            cursor={"pointer"}
                            onClick={onReject}
                            mt="5"
                            lineHeight={"1"}
                        >
                            Cancel
                        </Text>
                    </Box>
                </>
            )}
        </div>
    );
};

export default forwardRef(SignModal);
