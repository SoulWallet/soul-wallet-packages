import React, { createContext, useState, useEffect, createRef, useCallback, useMemo } from "react";
import { ethers } from "ethers";
import SignModal from "@src/components/SignModal";
import Locked from "@src/components/Locked";
import useKeyring from "@src/hooks/useKeyring";
import useConfig from "@src/hooks/useConfig";
import api from "@src/lib/api";
import { useGuardianStore } from "@src/store/guardian";

interface IWalletContext {
    ethersProvider: ethers.JsonRpcProvider;
    account: string;
    getAccount: () => Promise<void>;
    replaceAddress: () => Promise<void>;
    showLocked: () => void;
}

export const WalletContext = createContext<IWalletContext>({
    ethersProvider: new ethers.JsonRpcProvider(),
    account: "",
    getAccount: async () => {},
    replaceAddress: async () => {},
    showLocked: async () => {},
});

export const WalletContextProvider = ({ children }: any) => {
    const { selectedChainItem } = useConfig();
    const [account, setAccount] = useState<string>("");
    const [checkingLocked, setCheckingLocked] = useState(true);
    const { recoverRecordId } = useGuardianStore();
    const [recoverCheckInterval, setRecoverCheckInterval] = useState<any>();
    const signModal = createRef<any>();
    const lockedModal = createRef<any>();
    const keystore = useKeyring();

    const ethersProvider = useMemo(() => {
        if (!selectedChainItem) {
            // TODO, should await
            return new ethers.JsonRpcProvider();
        }
        return new ethers.JsonRpcProvider(selectedChainItem.provider);
    }, [selectedChainItem]);

    const getAccount = async () => {
        const res = await keystore.getAddress();
        setAccount(res);
    };

    const replaceAddress = async () => {
        await keystore.replaceAddress();
        await getAccount();
    };

    const checkLocked = async () => {
        const current = lockedModal.current;

        const res = await keystore.checkLocked();

        setCheckingLocked(false);

        if (res) {
            await current.show();
        }
    };

    const showLocked = async () => {
        await lockedModal.current.show();
    };

    const checkRecoverStatus = async() => {
        console.log('check recover status')
        const res = await api.guardian.getRecoverRecord({recoveryRecordID: recoverRecordId});
    };

    useEffect(() => {
        getAccount();
    }, []);

    useEffect(() => {
        if (!recoverRecordId) {
            return;
        }

        checkRecoverStatus();

        const interval = setInterval(checkRecoverStatus, 5000);

        setRecoverCheckInterval(interval);

        return () => {
            clearInterval(recoverCheckInterval);
        };
    }, [recoverRecordId]);

    useEffect(() => {
        const current = lockedModal.current;

        if (!current || !location) {
            return;
        }

        if (location.hash.indexOf("mode=web") === -1) {
            checkLocked();
        } else {
            setCheckingLocked(false);
        }
    }, [location.hash, lockedModal.current]);

    return (
        <WalletContext.Provider
            value={{
                ethersProvider,
                account,
                getAccount,
                replaceAddress,
                showLocked,
            }}
        >
            {!!checkingLocked ? "" : children}
            <SignModal ref={signModal} />
            <Locked ref={lockedModal} />
        </WalletContext.Provider>
    );
};

export const WalletContextConsumer = WalletContext.Consumer;
