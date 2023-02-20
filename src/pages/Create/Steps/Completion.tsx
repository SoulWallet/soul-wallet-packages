import Button from "@src/components/Button";
import browser from "webextension-polyfill";
import React from "react";

const Completion = () => {
    const handleToMyWallet = () => {
        // TODO: here
        browser.windows.create({
            type: "popup",
            url: `chrome-extension://${browser.runtime.id}/popup.html#`,
            width: 360,
            height: 600 + 28, // 28 is title bar
            top: 0,
            left: window.screen.width - 360,
        });
    };
    return (
        <div className="tip-text mx-0 pb-14">
            <p className="mt-9 mb-11 mx-0">
                Now you can use your wallet address to receive any cryptos, <br />
                and unlock full services by receiving xxx ETH/ xxx USDC (fee <br />
                for wallet deployment and gas fee).
            </p>

            <p className="text-warnRed">Warning: This is a beta version. Do NOT put in too much money.</p>

            <Button type="primary" onClick={handleToMyWallet} className="mt-47">
                See My Wallet
            </Button>
        </div>
    );
};

export default Completion;
