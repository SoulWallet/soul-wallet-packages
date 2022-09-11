import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "@src/assets/logo.svg";
import IconArrowBack from "@src/assets/arrow-left.svg";
import KeyStore from "@src/lib/keystore";
import IconMenu from "@src/assets/menu.svg";

const keyStore = KeyStore.getInstance();

interface IProps {
    backUrl?: string;
}

export function Navbar({ backUrl }: IProps) {
    const navigate = useNavigate();
    const doLockWallet = async () => {
        await keyStore.lock();
        navigate("/welcome");
    };

    return (
        <div className="navbar flex items-center justify-between">
            {backUrl ? (
                <Link
                    to={backUrl || "/wallet"}
                    className="btn btn-ghost btn-circle"
                >
                    <img src={IconArrowBack} className="w-6" />
                </Link>
            ) : (
                <Link to="/wallet" className="btn btn-ghost btn-circle">
                    <img src={Logo} className="w-12" />
                </Link>
            )}

            {!backUrl && (
                <div className="dropdown dropdown-end">
                    <label tabIndex={0} className="btn btn-ghost btn-circle">
                        <img src={IconMenu} />
                    </label>
                    <ul
                        tabIndex={0}
                        className="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52"
                    >
                        <li>
                            <Link to="/create-wallet">Create Wallet</Link>
                        </li>

                        <li>
                            <Link to="/recover-wallet">Recover Wallet</Link>
                        </li>
                        <li>
                            <a onClick={doLockWallet}>Lock Wallet</a>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
}
