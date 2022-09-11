import React, { useEffect, useState } from "react";
import Logo from "@src/assets/logo.svg";
import LogoText from "@src/assets/logo-text.svg";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@src/components/Input";
import KeyStore from "@src/lib/keystore";

const keyStore = KeyStore.getInstance();

export default function Welcome() {
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [isLocked, setIsLocked] = useState<boolean>(false);

    const navigate = useNavigate();

    const checkLocked = async () => {
        const res = await keyStore.checkLocked();
        setIsLocked(res);
    };

    const doUnlock = async () => {
        try {
            const address = await keyStore.unlock(password);
            if (address) {
                navigate("/wallet");
            }
        } catch (err) {
            setPasswordError("Wrong password. Try again.");
        }
    };

    useEffect(() => {
        checkLocked();
    }, []);

    return (
        <div className="h-full pt-11 pb-16 text-center flex flex-col justify-between">
            <div className="flex flex-col items-center">
                <img src={Logo} className="w-40 h-40 mb-2" />
                <img src={LogoText} />
            </div>
            <div className="px-6">
                {isLocked ? (
                    <>
                        <Input
                            value={password}
                            placeholder="Password"
                            type="password"
                            onChange={(val) => {
                                setPassword(val);
                                setPasswordError("");
                            }}
                            error={passwordError}
                        />
                        <a
                            className="btn btn-blue w-full my-4"
                            onClick={doUnlock}
                        >
                            Unlock
                        </a>
                    </>
                ) : (
                    <Link to="/create-wallet">
                        <a className="btn btn-blue w-full mb-4">
                            Create a Wallet
                        </a>
                    </Link>
                )}

                <Link to="/recover-wallet">
                    <a className="text-blueDeep text-sm">Recover a wallet</a>
                </Link>
            </div>
        </div>
    );
}
