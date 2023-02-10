import React, { useEffect, useState } from "react";
import Logo from "@src/assets/logo.svg";
import LogoText from "@src/assets/logo-text.svg";
import { getLocalStorage } from "@src/lib/tools";
import { Link, useNavigate } from "react-router-dom";
import { Input } from "@src/components/Input";
import KeyStore from "@src/lib/keystore";
import Button from "@src/components/Button";
import browser from "webextension-polyfill";

const keyStore = KeyStore.getInstance();

export default function Welcome() {
    const [password, setPassword] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [isLocked, setIsLocked] = useState<boolean>(false);
    const [unlocking, setUnlocking] = useState<boolean>(false);

    const navigate = useNavigate();

    const doUnlock = async () => {
        try {
            setUnlocking(true);
            const address = await keyStore.unlock(password);
            if (address) {
                navigate("/wallet");
            }
        } catch (err) {
            setPasswordError("Wrong password. Try again.");
        } finally {
            setUnlocking(false);
        }
    };

    // TODO, need to refactor this
    const determineDefaultRoute = async () => {
        const recovering = await getLocalStorage("recovering");
        const cachedRoute = await getLocalStorage("cachedRoute");

        if (recovering) {
            navigate("/recover-wallet");
        } else if (cachedRoute) {
            navigate(cachedRoute);
        } else {
            const res = await keyStore.checkLocked();
            if (res) {
                setIsLocked(true);
            }
        }
    };

    useEffect(() => {
        determineDefaultRoute();
    }, []);

    return (
        <div className="h-full pt-11 pb-16 text-center flex flex-col justify-between">
            <div className="flex flex-col items-center mb-4">
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
                            onEnter={doUnlock}
                            onChange={(val) => {
                                setPassword(val);
                                setPasswordError("");
                            }}
                            error={passwordError}
                        />
                        <Button
                            onClick={doUnlock}
                            loading={unlocking}
                            classNames="btn-blue my-4"
                        >
                            Unlock
                        </Button>
                    </>
                ) : (
                    <Link to="/create-wallet" className="btn btn-blue mb-4">
                        Create a Wallet
                    </Link>
                )}

                <Link to="/recover-wallet" className="text-blueDeep text-sm">
                    Recover Wallet
                </Link>

                <div
                    className="mt-8 text-slate-500 text-sm cursor-pointer"
                    onClick={() => {
                        browser.tabs.create({
                            url: browser.runtime.getURL(
                                "popup.html#/start?mode=web",
                            ),
                        });
                    }}
                >
                    Go to Start Page {"(for test use)"}
                </div>
            </div>
        </div>
    );
}
