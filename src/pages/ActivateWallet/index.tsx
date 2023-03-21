import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import Address from "@src/components/Address";
import { TokenSelect } from "@src/components/TokenSelect";
import CostItem from "@src/components/CostItem";
import { toast } from "material-react-toastify";
import config from "@src/config";
import useWallet from "@src/hooks/useWallet";
import { useBalanceStore } from "@src/store/balanceStore";
import useQuery from "@src/hooks/useQuery";
import PageTitle from "@src/components/PageTitle";
import BN from "bignumber.js";
import ReceiveCode from "@src/components/ReceiveCode";
import Button from "@src/components/Button";
import ApprovePaymaster from "@src/components/ApprovePaymaster";
import { EnAlign } from "@src/types/IAssets";

export default function ActivateWallet() {
    const { walletAddress, getWalletType, account } = useWalletContext();
    const [step, setStep] = useState(0);
    const [maxCost, setMaxCost] = useState("");
    const [payToken, setPayToken] = useState(config.zeroAddress);
    const [paymasterApproved, setPaymasterApproved] = useState(true);
    const [payTokenSymbol, setPayTokenSymbol] = useState("");
    const { getTokenByAddress, getBalances } = useQuery();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { activateWallet } = useWallet();
    const { balance } = useBalanceStore();

    const doActivate = async () => {
        setLoading(true);
        try {
            await activateWallet(payToken, paymasterApproved, false);
            getWalletType();
            navigate("/wallet");
            toast.success("Account activated");
        } catch (err) {
            toast.error("Failed to activate account");
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
        } else {
            setStep(1);
        }
    };

    const goBack = () => {
        if (step === 0) {
            navigate("/wallet");
        } else if (step === 1) {
            setStep(0);
        }
    };

    const onPayTokenChange = async () => {
        // TODO, clear previous request
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
        if (!paymasterApproved) {
            setPayToken(config.zeroAddress);
        }
    }, [paymasterApproved]);

    return (
        <>
            <Navbar />
            <div className="pb-28">
                <div className="px-6">
                    <PageTitle title="Activate Wallet" onBack={goBack} />
                </div>
                {step === 0 && (
                    <>
                        <div className="bg-gray20 px-6 py-4">
                            <div className="text-gray60 mb-1">To deploy wallet on {config.chainName} require</div>
                            <CostItem
                                value={maxCost ? `${maxCost} ${payTokenSymbol}` : "Loading..."}
                                // memo={`$ 10.00 USD`}
                                align={EnAlign.Left}
                            />
                            <div className="h-5" />
                            <TokenSelect
                                label="Gas"
                                ethOnly={!paymasterApproved}
                                labelTip="Hell world"
                                selectedAddress={payToken}
                                onChange={setPayToken}
                            />
                        </div>
                        <div className="my-5 px-6">
                            <div className="mb-1">Wallet address</div>
                            <div className="bg-gray20 rounded-lg p-3">
                                <ReceiveCode imgWidth="w-24" walletAddress={walletAddress} addressTop={true} />
                            </div>
                        </div>
                        <div className="px-6">
                            <ApprovePaymaster value={paymasterApproved} onChange={setPaymasterApproved} />
                        </div>
                    </>
                )}

                {step === 1 && (
                    <div className="px-6">
                        <div className="mb-6">
                            <Address value={walletAddress} />
                        </div>
                        <CostItem label="Total Cost" memo={`Max: ${maxCost} ${payTokenSymbol}`} />
                    </div>
                )}

                <div className="sign-bottom">
                    {step === 0 && (
                        <Button disabled={!maxCost} type="primary" className="flex-1 w-full" onClick={goNext}>
                            Next
                        </Button>
                    )}

                    {step === 1 && (
                        <>
                            <Button type="reject" className="flex-1 w-full" onClick={() => navigate("/wallet")}>
                                Reject
                            </Button>
                            <Button type="primary" className="flex-1 w-full" onClick={doActivate} loading={loading}>
                                Confirm
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
