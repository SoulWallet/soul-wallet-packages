import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
import React from "react";

const StepCompletion = () => {
    const { goPlugin } = useBrowser();
    const handleToMyWallet = () => {
        goPlugin();
    };
    return (
        <div className="tip-text mx-0 pb-6">
            <p className="mt-2 mb-3 mx-0">
                Now you can use your wallet address to receive any cryptos, <br />
                and unlock full services by activiting your wallet.
            </p>

            <p className="text-warnRed">Warning: This is a alpha version. Do NOT put in too much money.</p>

            <Button type="primary" onClick={handleToMyWallet} className="mt-2 w-full">
                See My Wallet
            </Button>
        </div>
    );
};

export default StepCompletion;
