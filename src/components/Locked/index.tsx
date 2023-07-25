import React, { useState, useImperativeHandle, forwardRef } from "react";
import Logo from "@src/assets/logo.svg";
import { Image, Flex } from "@chakra-ui/react";
import { Input } from "@src/components/Input";
import cn from "classnames";
import KeyStore from "@src/lib/keystore";
import Button from "@src/components/Button";
import useBrowser from "@src/hooks/useBrowser";
const keyStore = KeyStore.getInstance();

export default forwardRef<any>((props, ref) => {
    const { goWebsite } = useBrowser();
    const [promiseInfo, setPromiseInfo] = useState<any>({});
    const [password, setPassword] = useState<string>("");
    const [visible, setVisible] = useState(false);
    const [passwordError, setPasswordError] = useState<string>("");
    const [unlocking, setUnlocking] = useState<boolean>(false);
    useImperativeHandle(ref, () => ({
        async show() {
            return new Promise((resolve, reject) => {
                setPromiseInfo({
                    resolve,
                    reject,
                });
                setVisible(true);
            });
        },
    }));

    const doUnlock = async () => {
        try {
            setUnlocking(true);
            await keyStore.unlock(password);
            setVisible(false);
            setPassword("");
        } catch (err) {
            setPasswordError("Wrong password. Try again.");
        } finally {
            setUnlocking(false);
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "h-full text-center flex flex-col justify-between z-30 absolute top-0 bottom-0 left-0 right-0 bg-white overflow-auto",
                !visible && "hidden",
            )}
        >
            <div className="px-6">
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
                    <Button onClick={doUnlock} loading={unlocking} type="primary" className="my-4 w-full">
                        Unlock
                    </Button>
                </>

                <a onClick={() => goWebsite("/recover")} className="text-blueDeep text-sm cursor-pointer">
                    Recover Wallet
                </a>
            </div>
        </div>
    );
});
