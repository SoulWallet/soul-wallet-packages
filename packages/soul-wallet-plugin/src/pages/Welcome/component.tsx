import React from "react";
import Logo from "@src/assets/logo.svg";
import LogoText from "@src/assets/logo-text.svg";
import { WalletLib } from "../../../soul-wallet-corelib";
import { Link } from "react-router-dom";
import sdk from "@src/sdk";
import config from "@src/config";

export function Welcome() {
    return (
        <>
            {/* <Navbar /> */}
            <div className="h-full pt-11 pb-16 text-center flex flex-col justify-between">
                <div className="flex flex-col items-center">
                    <img src={Logo} className="w-40 h-40 mb-2" />
                    <img src={LogoText} />
                </div>
                <div className="px-6">
                    <Link to="/create-wallet">
                        <a className="btn btn-blue w-full mb-4">
                            Create a Wallet
                        </a>
                    </Link>
                    <Link to="/recover-wallet">
                        <a className="text-blueDeep text-sm">
                            Recover a wallet
                        </a>
                    </Link>
                </div>
            </div>
        </>
    );
}
