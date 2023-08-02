import React, { useEffect, useState } from "react";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import { TokenSelect } from "@src/components/TokenSelect";
import CostItem from "@src/components/CostItem";
import { toast } from "material-react-toastify";
import config from "@src/config";
import useWallet from "@src/hooks/useWallet";
import { Box, Text, Flex, Divider } from "@chakra-ui/react";
import { useBalanceStore } from "@src/store/balanceStore";
import { InfoWrap, InfoItem } from "@src/components/SignTransaction";
import useQuery from "@src/hooks/useQuery";
import GasSelect from "@src/components/SendAssets/comp/GasSelect";
import useBrowser from "@src/hooks/useBrowser";
import PageTitle from "@src/components/PageTitle";
import BN from "bignumber.js";
import ReceiveCode from "@src/components/ReceiveCode";
import Button from "@src/components/Button";
import ApprovePaymaster from "@src/components/ApprovePaymaster";
import { EnAlign } from "@src/types/IAssets";

export default function ActivateWallet() {
    const { walletAddress, getWalletType, account, walletType } = useWalletContext();
    const [maxCost, setMaxCost] = useState("");
    const [payToken, setPayToken] = useState(config.zeroAddress);
    const [paymasterApproved, setPaymasterApproved] = useState(true);
    const [payTokenSymbol, setPayTokenSymbol] = useState("");
    const { getTokenByAddress, getBalances } = useQuery();
    const [loading, setLoading] = useState(false);
    const { activateWallet } = useWallet();
    const { navigate } = useBrowser();
    const { balance } = useBalanceStore();

    useEffect(() => {
        if (walletType === "contract") {
            navigate("wallet");
        }
    }, [walletType]);

    const doActivate = async () => {
        setLoading(true);
        try {
            await activateWallet(payToken, paymasterApproved, false);
            getWalletType();
            navigate("wallet");
            toast.success("Account activated");
        } catch (err) {
            toast.error(String(err));
            console.log("activate error", err);
        } finally {
            setLoading(false);
        }
    };

    const goNext = () => {
        const userBalance = balance.get(payToken) || 0;
        if (new BN(userBalance).isLessThan(maxCost)) {
            toast.error("Balance not enough");
            return;
        }
    };

    const onPayTokenChange = async () => {
        // important TODO, clear previous request
        setMaxCost("");
        const token = getTokenByAddress(payToken);
        setPayTokenSymbol(token.symbol);
        const { requireAmount, requireAmountInWei }: any = await activateWallet(payToken, paymasterApproved, true);
        setMaxCost(requireAmount);
    };

    const checkBalance = async () => {
        getBalances();
    };

    useEffect(() => {
        if (!account || !payToken || !walletAddress) {
            return;
        }
        onPayTokenChange();
    }, [payToken, account, walletAddress]);

    useEffect(() => {
        const intervalId = setInterval(() => {
            checkBalance();
        }, 3000);

        return () => clearInterval(intervalId);
    }, []);

    useEffect(() => {
        if (!walletAddress) {
            return;
        }
        getWalletType();
    }, [walletAddress]);

    useEffect(() => {
        if (!paymasterApproved) {
            setPayToken(config.zeroAddress);
        }
    }, [paymasterApproved]);

    const balanceEnough = false;

    return (
        <Box px="5" pt="6">
            <Navbar backUrl="wallet" />
            <PageTitle mb="0">Activate your Soul Wallet</PageTitle>
            <Text fontWeight={"600"} my="12px">
                Setting up your wallet requires a fee to cover deployment gas costs. This is not a Soul Wallet service
                charge.
                <br />
                <br />
                Add any of the following tokens to your wallet, and then you can continue the activation process: ETH,
                USDC, DAI, USDT.
            </Text>
            <Box bg="#fff" rounded="20px" p="3">
                <ReceiveCode walletAddress={walletAddress} />
                <Divider h="1px" bg="#d7d7d7" my="2" />
                <InfoWrap gap="3">
                    <InfoItem>
                        <Text>Network</Text>
                        <Text>Ethereum</Text>
                    </InfoItem>
                    <InfoItem>
                        <Text>Network fee</Text>
                        {maxCost ? (
                            <Flex gap="2">
                                <Text>{maxCost}</Text>
                                <GasSelect gasToken={payToken} onChange={setPayToken} />
                            </Flex>
                        ) : (
                            "Loading..."
                        )}
                    </InfoItem>
                </InfoWrap>
            </Box>

            <Button
                disabled={!maxCost || !balanceEnough}
                w="full"
                onClick={doActivate}
                fontSize="20px"
                py="4"
                fontWeight={"800"}
                mt="14px"
            >
                Activate
            </Button>

            {!balanceEnough && (
                <Text
                    color="#FF2096"
                    textAlign={"center"}
                    fontSize={"12px"}
                    fontWeight={"500"}
                    fontFamily={"Martian"}
                    mt="1"
                >
                    Not enough {payTokenSymbol} for activation
                </Text>
            )}

            {/* {step === 1 && (
                        <>
                            <Button type="reject" className="flex-1 w-full" onClick={() => navigate("wallet")}>
                                Reject
                            </Button>
                            <Button type="primary" className="flex-1 w-full" onClick={doActivate} loading={loading}>
                                Confirm
                            </Button>
                        </>
                    )} */}

            {/* <div className="px-6">
                            <ApprovePaymaster value={paymasterApproved} onChange={setPaymasterApproved} />
                        </div> */}
        </Box>
    );
}
