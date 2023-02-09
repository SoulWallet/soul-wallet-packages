import React, { useState, forwardRef, useImperativeHandle } from "react";
import cn from "classnames";
import { EIP4337Lib } from "soul-wallet-lib";
import useWalletContext from "@src/context/hooks/useWalletContext";
import useQuery from "@src/hooks/useQuery";
import AddressIcon from "../AddressIcon";
import Button from "../Button";

export default forwardRef<any>((props, ref) => {
    const { account } = useWalletContext();
    const { getEthBalance } = useQuery();
    const [ethBalance, setEthBalance] = useState<string>("");
    const [keepModalVisible, setKeepModalVisible] = useState(false);
    const [visible, setVisible] = useState<boolean>(false);
    const [actionName, setActionName] = useState<string>("");
    const [origin, setOrigin] = useState<string>("");
    const [promiseInfo, setPromiseInfo] = useState<any>({});
    const [decodedData, setDecodedData] = useState<any>({});
    const [signing, setSigning] = useState<boolean>(false);

    useImperativeHandle(ref, () => ({
        async show(
            operation: any,
            _actionName: string,
            origin: string,
            keepVisible: boolean,
        ) {
            setActionName(_actionName);
            setOrigin(origin);
            const balance = await getEthBalance();
            setEthBalance(balance);
            setKeepModalVisible(keepVisible || false);

            // todo, there's a problem when sendETH
            if (operation) {
                console.log("sign op", operation);

                const tmpMap = new Map<string, string>();
                EIP4337Lib.Utils.DecodeCallData.new().setStorage(
                    (key, value) => {
                        tmpMap.set(key, value);
                    },
                    (key) => {
                        const v = tmpMap.get(key);
                        if (typeof v === "string") {
                            return v;
                        }
                        return null;
                    },
                );

                const callDataDecode =
                    await EIP4337Lib.Utils.DecodeCallData.new().decode(
                        operation.callData,
                    );
                console.log(`callDataDecode:`, callDataDecode);
                setDecodedData(callDataDecode);
            }

            return new Promise((resolve, reject) => {
                setPromiseInfo({
                    resolve,
                    reject,
                });
                setVisible(true);
            });
        },
    }));

    const onReject = async () => {
        promiseInfo.reject();
        if (!keepModalVisible) {
            setVisible(false);
            setSigning(false);
        }
    };

    const onConfirm = async () => {
        setSigning(true);
        promiseInfo.resolve();
        if (!keepModalVisible) {
            setVisible(false);
            setSigning(false);
        }
    };

    return (
        <div
            ref={ref}
            className={cn(
                "flex flex-col justify-between h-full p-6 z-20 absolute top-0 bottom-0 left-0 right-0 bg-white",
                !visible && "hidden",
            )}
        >
            <div>
                <div className="page-title mb-10">Signature Request</div>
                <div className="mb-6">
                    <div className="mb-4">Account</div>
                    <div className="flex gap-2 items-center">
                        <AddressIcon width={48} address={account} />
                        <div>
                            <div className="font-bold text-lg font-sans">
                                {account.slice(0, 6)}...{account.slice(-6)}
                            </div>
                            <div>Balance: {ethBalance} ETH</div>
                        </div>
                    </div>
                </div>
                <div className="mb-6">
                    <div className="mb-2">Origin</div>
                    <div className="font-bold text-lg">{origin}</div>
                </div>
                <div>
                    <div className="mb-2">Message</div>
                    <div className="font-bold bg-gray40 p-3 rounded-lg">
                        {actionName
                            ? actionName
                            : decodedData
                            ? JSON.stringify(decodedData)
                            : ""}
                    </div>
                </div>
            </div>

            <div className="flex gap-2">
                <Button classNames="w-1/2" onClick={onReject}>
                    Cancel
                </Button>
                <Button
                    classNames="btn-blue w-1/2"
                    onClick={onConfirm}
                    loading={signing}
                >
                    Sign
                </Button>
            </div>
        </div>
    );
});
