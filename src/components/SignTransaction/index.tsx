import React, { useState, forwardRef, useImperativeHandle, useEffect, Ref } from "react";
import BN from "bignumber.js";
import cn from "classnames";
import useLib from "@src/hooks/useLib";
import useQuery from "@src/hooks/useQuery";
import useWalletContext from "@src/context/hooks/useWalletContext";
import config from "@src/config";
import CostItem from "../CostItem";
import useTools from "@src/hooks/useTools";
import AddressIcon from "../AddressIcon";
import Button from "../Button";
import AddressInput from "../SendAssets/comp/AddressInput";
import { Flex, Box, Text } from "@chakra-ui/react";
import { TokenSelect } from "../TokenSelect";
import GasSelect from "../SendAssets/comp/GasSelect";

enum SignTypeEn {
    Transaction,
    Message,
    Account,
}

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
            const maxUSDC = requireAmountInWei.mul(config.maxCostMultiplier).div(100);

            const maxUSDCFormatted = BN(requireAmount).times(config.maxCostMultiplier).div(100).toFixed(4);

            const paymasterAndData = soulWalletLib.getPaymasterData(config.contracts.paymaster, payToken, maxUSDC);

            setActivePaymasterData(paymasterAndData);

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
                        <Text fontSize="20px" fontWeight="800" color="#1e1e1e">
                            {signType === SignTypeEn.Account && `Get Account`}
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
                                {signType === SignTypeEn.Account && "Get Accounts"}
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
                                    <Flex
                                        fontSize="12px"
                                        fontWeight={"500"}
                                        px="4"
                                        gap="6"
                                        fontFamily={"Martian"}
                                        flexDir={"column"}
                                    >
                                        <Flex align="center" justify={"space-between"}>
                                            <Text>Gas fee ($2.22)</Text>
                                            <Flex gap="2">
                                                <Text>{feeCost.split(" ")[0]}</Text>
                                                <GasSelect gasToken={payToken} onChange={setPayToken} />
                                            </Flex>
                                        </Flex>
                                        <Flex align="center" justify={"space-between"}>
                                            <Text>Total</Text>
                                            <Text>$1736.78</Text>
                                        </Flex>
                                    </Flex>
                                </>
                            )}
                        </Flex>

                        {signType === SignTypeEn.Account && (
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
                                Confirm
                            </Button>
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
