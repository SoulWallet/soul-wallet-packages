import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
import React from "react";

const StepCompletion = () => {
    const { goPlugin } = useBrowser();

    return (
        <div className="tip-text mx-0 pb-6">
            <p className="mt-2 mb-3 mx-0">
                Now you can use your wallet address to receive any cryptos, <br />
                and unlock full services by activiting your wallet.
            </p>

            <p className="text-warnRed mt-16">Warning: This is an alpha version. DO NOT put too much money in.</p>

            <Button type="primary" onClick={() => goPlugin("/activate-wallet")} className="mt-2 w-full">
                Activate Wallet
            </Button>
            <Button type="link" onClick={() => goPlugin("")} className="mt-2 w-full">
                Activate Later
            </Button>
        </div>
    );
};

export default StepCompletion;
