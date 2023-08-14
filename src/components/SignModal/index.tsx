import React, { useState, forwardRef, useImperativeHandle, useEffect, Ref } from "react";
import useQuery from "@src/hooks/useQuery";
import config from "@src/config";
import useTools from "@src/hooks/useTools";
import { useChainStore } from "@src/store/chainStore";
import api from "@src/lib/api";
import { useAddressStore } from "@src/store/address";
import { ethers } from "ethers";
import IconLogo from "@src/assets/logo-v3.svg";
import IconLock from "@src/assets/icons/lock.svg";
import Button from "../Button";
import AddressInput from "../SendAssets/comp/AddressInput";
import { Flex, Box, Text, Image } from "@chakra-ui/react";
import GasSelect from "../SendAssets/comp/GasSelect";
import { UserOpUtils, UserOperation } from "@soulwallet/sdk";
import useSdk from "@src/hooks/useSdk";
import useConfig from "@src/hooks/useConfig";

enum SignTypeEn {
    Transaction,
    Message,
    Account,
}

enum SecurityLevel {
    High = "High",
    Medium = "Medium",
    Low = "Low",
}

const getSecurityColor = (level: SecurityLevel) => {
    switch (level) {
        case SecurityLevel.High:
            return "#1CD20F";
        case SecurityLevel.Medium:
            return "#DB9E00";
        case SecurityLevel.Low:
            return "#E83D26";
        default:
            return "#000";
    }
};

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

const DappAvatar = ({ avatar }: any) => (
    <Flex align="center" justify={"center"} bg="#fff" rounded="full" w="72px" h="72px">
        <Image src={avatar} w="44px" h="44px" />
    </Flex>
);

const SignModal = (_: unknown, ref: Ref<any>) => {
    const { selectedAddress } = useAddressStore();
    const [keepModalVisible, setKeepModalVisible] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [loadingFee, setLoadingFee] = useState(false);
    const [origin, setOrigin] = useState<string>("");
    const [promiseInfo, setPromiseInfo] = useState<any>({});
    const [decodedData, setDecodedData] = useState<any>({});
    const [signing, setSigning] = useState<boolean>(false);
    const [payToken, setPayToken] = useState(ethers.ZeroAddress);
    const [feeCost, setFeeCost] = useState("");
    const [activeOperation, setActiveOperation] = useState<UserOperation>();
    const [signType, setSignType] = useState<SignTypeEn>();
    const [messageToSign, setMessageToSign] = useState("");
    const { selectedChainId } = useChainStore();
    const { decodeCalldata } = useTools();
    const { getFeeCost, getGasPrice } = useQuery();
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

            const userOp = userOpRet.OK;
            userOp.maxFeePerGas = maxFeePerGas;
            userOp.maxPriorityFeePerGas = maxPriorityFeePerGas;

            // get gas limit
            // const gasLimit = await soulWallet.estimateUserOperationGas(userOp);

            // if (gasLimit.isErr()) {
            //     throw new Error(gasLimit.ERR.message);
            // }

            if (!userOp) {
                throw new Error("Failed to format tx");
            }

            return userOp;
        } catch (err) {
            console.log(err);
        }
    };

    useImperativeHandle(ref, () => ({
        async show(obj: any) {
            const { txns, actionType, origin, keepVisible, msgToSign, sendTo } = obj;
            setVisible(true);
            // setActionName(_actionName);
            setOrigin(origin);

            setKeepModalVisible(keepVisible || false);

            console.log("send to is", sendTo);
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
                setActiveOperation(userOp);
                const callDataDecodes = await decodeCalldata(selectedChainId, chainConfig.contracts.entryPoint, userOp);
                console.log("decoded data", callDataDecodes);
                setDecodedData(callDataDecodes);
                checkSponser(userOp);
            }

            if (msgToSign) {
                setMessageToSign(msgToSign);
            }

            return new Promise((resolve, reject) => {
                setPromiseInfo({
                    resolve,
                    reject,
                });
                // setVisible(true);
            });
        },
    }));

    const onReject = async () => {
        promiseInfo.reject("User reject");
        if (!keepModalVisible) {
            setVisible(false);
            setSigning(false);
        }
    };

    const onConfirm = async () => {
        setSigning(true);

        if (payToken === ethers.ZeroAddress) {
            promiseInfo.resolve({ userOp: activeOperation, payToken });
        } else {
            promiseInfo.resolve({ userOp: activeOperation, payToken });
        }

        if (!keepModalVisible) {
            setVisible(false);
            setSigning(false);
        }
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
        console.log("sponsor res", res);
    };

    const getFeeCostA = async () => {
        setLoadingFee(true);
        setFeeCost("");

        // TODO, extract this for other functions
        const { requiredAmount } = await getFeeCost(activeOperation, payToken);

        if (ethers.ZeroAddress === payToken) {
            setFeeCost(`${requiredAmount} ${chainConfig.chainToken}`);
        } else {
            setFeeCost(`${requiredAmount} USDC`);
        }
        setLoadingFee(false);
    };

    useEffect(() => {
        if (!activeOperation || !payToken) {
            return;
        }
        getFeeCostA();
    }, [payToken, activeOperation]);

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
                        {signType === SignTypeEn.Account && (
                            <Box pt="5">
                                <Box textAlign={"center"}>
                                    <Flex
                                        align="center"
                                        display={"inline-flex"}
                                        gap="3"
                                        border={"dashed 2px"}
                                        p="4"
                                        borderColor={"#898989"}
                                        rounded="100px"
                                        mx="auto"
                                        mb="5"
                                        position={"relative"}
                                    >
                                        <DappAvatar avatar={IconLogo} />
                                        {/** TODO, get favicon here */}
                                        <DappAvatar avatar={`${config.faviconUrl}${origin}`} />
                                        <Image
                                            src={IconLock}
                                            position={"absolute"}
                                            left="0"
                                            right="0"
                                            bottom="-3"
                                            m="auto"
                                        />
                                    </Flex>
                                </Box>

                                <Box textAlign={"center"} mb="14px">
                                    <Text fontSize={"20px"} fontWeight={"800"} mb="1">
                                        Connect to dapp
                                    </Text>
                                    <Text fontWeight={"600"}>{origin}</Text>
                                </Box>
                                <Box bg="#fff" rounded="20px" p="4" mb="6">
                                    <Text fontSize={"18px"} fontWeight={"800"} mb="1">
                                        Allow
                                    </Text>
                                    <Box fontSize={"14px"} fontWeight={"600"}>
                                        <Text mb="1">•&nbsp;&nbsp;View account address and transactions</Text>
                                        <Text>•&nbsp;&nbsp;Suggest transactions</Text>
                                    </Box>
                                </Box>
                                <InfoWrap>
                                    <InfoItem>
                                        <Text>Site security:</Text>
                                        <Text color={getSecurityColor(SecurityLevel.High)}>{SecurityLevel.High}</Text>
                                    </InfoItem>
                                    <InfoItem>
                                        <Text>{selectedAddressItem.title}:</Text>
                                        <Text>
                                            {selectedAddress.slice(0, 5)}...{selectedAddress.slice(-4)}
                                        </Text>
                                    </InfoItem>
                                </InfoWrap>
                                <Button
                                    w="100%"
                                    fontSize={"20px"}
                                    py="5"
                                    fontWeight={"800"}
                                    mt="6"
                                    onClick={onConfirm}
                                    loading={signing}
                                    disabled={loadingFee}
                                >
                                    Connect
                                </Button>
                            </Box>
                        )}

                        {signType !== SignTypeEn.Account && (
                            <>
                                <Text fontSize="20px" fontWeight="800" color="#1e1e1e">
                                    {signType === SignTypeEn.Transaction && `Signature Request`}
                                    {signType === SignTypeEn.Message && `Sign Message`}
                                </Text>

                                {origin && (
                                    <Text fontWeight={"600"} mt="1">
                                        {origin}
                                    </Text>
                                )}

                                <Flex flexDir={"column"} gap="5" mt="6">
                                    <Box bg="#fff" py="3" px="4" rounded="20px" fontWeight={"800"}>
                                        {signType === SignTypeEn.Transaction && (
                                            <div>
                                                {decodedData && decodedData.length > 0
                                                    ? decodedData.map((item: any, index: number) => (
                                                          <span className="mr-1 capitalize" key={index}>
                                                              {decodedData.length > 1 && `${index + 1}.`}
                                                              {item.functionName || "Contract interaction"}
                                                          </span>
                                                      ))
                                                    : "Contract interaction"}
                                            </div>
                                        )}
                                        {signType === SignTypeEn.Message && messageToSign}
                                    </Box>
                                    <AddressInput label="From" address={selectedAddress} disabled />
                                    {sendToAddress ? (
                                        <AddressInput label="To" address={sendToAddress} disabled={true} />
                                    ) : (
                                        <AddressInput
                                            label="To"
                                            address={decodedData[0] && decodedData[0].to}
                                            disabled={true}
                                        />
                                    )}

                                    {signType === SignTypeEn.Transaction && (
                                        <>
                                            <InfoWrap>
                                                <InfoItem>
                                                    <Text>Gas fee</Text>
                                                    {/* <Text>Gas fee ($2.22)</Text> */}
                                                    {feeCost ? (
                                                        <Flex gap="2">
                                                            <Text>{feeCost.split(" ")[0]}</Text>
                                                            <GasSelect gasToken={payToken} onChange={setPayToken} />
                                                        </Flex>
                                                    ) : (
                                                        <Text>Loading...</Text>
                                                    )}
                                                </InfoItem>
                                                <InfoItem>
                                                    <Text>Total</Text>
                                                    <Text>$1736.78</Text>
                                                </InfoItem>
                                            </InfoWrap>
                                        </>
                                    )}
                                </Flex>
                            </>
                        )}

                        {signType === SignTypeEn.Transaction && (
                            <Button
                                w="100%"
                                fontSize={"20px"}
                                py="4"
                                fontWeight={"800"}
                                mt="6"
                                onClick={onConfirm}
                                loading={signing}
                                disabled={loadingFee}
                            >
                                Sign
                            </Button>
                        )}
                        {signType === SignTypeEn.Message && (
                            <Button w="100%" fontSize={"20px"} py="4" fontWeight={"800"} mt="6" onClick={onSign}>
                                Sign
                            </Button>
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
