import React from "react";
import { useNavigate } from "react-router-dom";
import useWalletContext from "@src/context/hooks/useWalletContext";
import { Navbar } from "@src/components/Navbar";
import PageTitle from "@src/components/PageTitle";
import ReceiveCode from "@src/components/ReceiveCode";
import Button from "@src/components/Button";
import ApprovePaymaster from "@src/components/ApprovePaymaster";

export default function ActivateWallet() {
    const { walletAddress } = useWalletContext();
    const navigate = useNavigate();

    return (
        <>
            <Navbar />
            <div className="px-6 pb-8">
                <PageTitle title="Activate Wallet" onBack={() => navigate("/wallet")} />
                <ApprovePaymaster />

                <div className="my-6">
                    <div className="mb-1">Wallet address</div>
                    <div className="bg-gray20 rounded-lg p-3">
                        <ReceiveCode walletAddress={walletAddress} addressTop={true} />
                    </div>
                </div>

                <Button onClick={() => {}} className="btn-blue">
                    Next
                </Button>
            </div>
        </>
    );
}
