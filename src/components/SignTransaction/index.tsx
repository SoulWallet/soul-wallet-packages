import React, { useState, forwardRef, useImperativeHandle, useEffect, Ref } from "react";
import BN from "bignumber.js";
import useLib from "@src/hooks/useLib";
import useQuery from "@src/hooks/useQuery";
import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import CostItem from "../CostItem";
import useTools from "@src/hooks/useTools";
import AddressIcon from "../AddressIcon";
import IconLogo from "@src/assets/logo-v3.svg";
import IconLock from "@src/assets/icons/lock.svg";
import Button from "../Button";
import AddressInput from "../SendAssets/comp/AddressInput";
import { Flex, Box, Text, Image, useColorModeValue } from "@chakra-ui/react";
import { TokenSelect } from "../TokenSelect";
import GasSelect from "../SendAssets/comp/GasSelect";

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

const SignTransaction = (_: unknown, ref: Ref<any>) => {
    const { walletAddress = "" } = useWalletContext(); // ! check this
    const [keepModalVisible, setKeepModalVisible] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [loadingFee, setLoadingFee] = useState(false);
    const [origin, setOrigin] = useState<string>("");
    const [promiseInfo, setPromiseInfo] = useState<any>({});
    const [decodedData, setDecodedData] = useState<any>({});
    const [signing, setSigning] = useState<boolean>(false);
    const [payToken, setPayToken] = useState(config.zeroAddress);
    const [feeCost, setFeeCost] = useState("");
    const [activeOperation, setActiveOperation] = useState("");
    const [signType, setSignType] = useState<SignTypeEn>();
    const [messageToSign, setMessageToSign] = useState("");
    const [activePaymasterData, setActivePaymasterData] = useState({});
    const { soulWalletLib } = useLib();
    const { decodeCalldata } = useTools();
    const { getFeeCost } = useQuery();

    useImperativeHandle(ref, () => ({
        async show(
            operation: any,
            _actionName: string,
            origin: string,
            keepVisible: boolean,
            _messageToSign: string = "",
        ) {
            // setActionName(_actionName);
            setOrigin(origin);

            setKeepModalVisible(keepVisible || false);

            if (_actionName === "getAccounts") {
                setSignType(SignTypeEn.Account);
            } else if (_actionName === "signMessage" || _actionName === "signMessageV4") {
                setSignType(SignTypeEn.Message);
            } else {
                setSignType(SignTypeEn.Transaction);
            }

            if (operation) {
                setActiveOperation(operation);
                const callDataDecode = await decodeCalldata(operation.callData);
                setDecodedData(callDataDecode);
            }

            if (_messageToSign) {
                setMessageToSign(_messageToSign);
            }

            return new Promise((resolve, reject) => {
                setPromiseInfo({
                    resolve,
                    reject,
                });
                setVisible(true);
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

        if (config.zeroAddress === payToken) {
            promiseInfo.resolve();
        } else {
            promiseInfo.resolve(activePaymasterData);
        }

        if (!keepModalVisible) {
            setVisible(false);
            setSigning(false);
        }
    };

    const onSign = async () => {
        promiseInfo.resolve();
    };

    const getFeeCostAndPaymasterData = async () => {
        setLoadingFee(true);
        setFeeCost("");

        // TODO, extract this for other functions
        const { requireAmountInWei, requireAmount } = await getFeeCost(
            activeOperation,
            payToken === config.zeroAddress ? "" : payToken,
        );

        if (config.zeroAddress === payToken) {
            setActivePaymasterData("");
            setFeeCost(`${requireAmount} ${config.chainToken}`);
        } else {
            const maxUSDC = BN(requireAmountInWei.toString()).times(config.maxCostMultiplier).div(100);

            const maxUSDCFormatted = BN(requireAmount.toString()).times(config.maxCostMultiplier).div(100).toFixed(4);

            // const paymasterAndData = soulWalletLib.getPaymasterData(config.contracts.paymaster, payToken, maxUSDC);

            // setActivePaymasterData(paymasterAndData);

            setFeeCost(`${maxUSDCFormatted} USDC`);
        }
        setLoadingFee(false);
    };

    useEffect(() => {
        if (!activeOperation || !payToken) {
            return;
        }
        getFeeCostAndPaymasterData();
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
                                        <Text>Account 1:</Text>
                                        <Text>
                                            {walletAddress.slice(0, 5)}...{walletAddress.slice(-4)}
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
                                                              {index + 1}.{item.functionName}
                                                          </span>
                                                      ))
                                                    : "Contract interaction"}
                                            </div>
                                        )}
                                        {signType === SignTypeEn.Message && messageToSign}
                                    </Box>
                                    <AddressInput label="From" address={walletAddress} disabled />
                                    <AddressInput label="To" address={"0x1111"} disabled={true} />
                                    {signType === SignTypeEn.Transaction && (
                                        <>
                                            <InfoWrap>
                                                <InfoItem>
                                                    <Text>Gas fee ($2.22)</Text>
                                                    <Flex gap="2">
                                                        <Text>{feeCost.split(" ")[0]}</Text>
                                                        <GasSelect gasToken={payToken} onChange={setPayToken} />
                                                    </Flex>
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

export default forwardRef(SignTransaction);
