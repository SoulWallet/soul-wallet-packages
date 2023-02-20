import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
import React from "react";

const Completion = () => {
    const { openWallet } = useBrowser();
    const handleToMyWallet = () => {
        openWallet();
    };
    return (
        <div className="tip-text mx-0 pb-6">
            <p className="mt-2 mb-3 mx-0">
                Now you can use your wallet address to receive any cryptos, <br />
                and unlock full services by receiving xxx ETH/ xxx USDC (fee <br />
                for wallet deployment and gas fee).
            </p>

            <p className="text-warnRed">Warning: This is a beta version. Do NOT put in too much money.</p>

            <Button type="primary" onClick={handleToMyWallet} className="mt-2">
                See My Wallet
            </Button>
        </div>
    );
};

export default Completion;
