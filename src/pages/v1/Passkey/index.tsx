import React, { useState, useImperativeHandle, forwardRef } from "react";
import Logo from "@src/assets/logo.svg";
import LogoText from "@src/assets/logo-text.svg";
import { Input } from "@src/components/Input";
import cn from "classnames";
import Button from "@src/components/Button";
import { client } from "@passwordless-id/webauthn";

export default function Passkey() {
    const [username, setUsername] = useState<string>("");
    const [passwordError, setPasswordError] = useState<string>("");
    const [passkeys, setPasskeys] = useState<any>([]);

    const doRegister = async () => {
        const challenge = "1234567890";
        const registration = await client.register(username, challenge, {
            authenticatorType: "auto",
            userVerification: "required",
            timeout: 60000,
            attestation: false,
            debug: false,
        });
        console.log('registration', registration)
        setPasskeys((prev: any) => [...prev, registration]);
    };

    const doActivate = async () => {};

    return (
        <div
            className={cn(
                "h-full pt-11 pb-8 text-center flex flex-col justify-between  z-30 absolute top-0 bottom-0 left-0 right-0 bg-white overflow-auto",
            )}
        >
            <div className="flex flex-col items-center mb-4">
                <img src={Logo} className="w-40 h-40 mb-2" />
                <img src={LogoText} />
            </div>
            <div className="px-6">
                <>
                    {passkeys.length > 0 ? (
                        <>
                            <div>Your passkeys</div>
                            {passkeys.map((i: any) => (
                                <div className="my-4 p-4 break-words border border-gray-200" key={i.username}>
                                    <div className="mb-2">Username: {i.username}</div>
                                    <div className="mb-2">Pubkey: {i.credential.publicKey}</div>
                                    <Button onClick={doActivate} type="primary" className="my-4">
                                        Activate wallet
                                    </Button>
                                </div>
                            ))}
                        </>
                    ) : (
                        <>
                            <Input
                                value={username}
                                placeholder="Username"
                                onEnter={doRegister}
                                onChange={setUsername}
                                error={passwordError}
                            />
                            <Button onClick={doRegister} type="primary" className="my-4 w-full">
                                Register
                            </Button>
                        </>
                    )}
                </>
            </div>
        </div>
    );
}
