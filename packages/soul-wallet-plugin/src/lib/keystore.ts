/*
 * @Description: keystore class
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-31 20:05:46
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-31 20:34:16
 */

import Web3 from "web3";
// import { ethers } from "ethers";
import {
    setLocalStorage,
    getLocalStorage,
    removeSessionStorage,
    getSessionStorage,
    setSessionStorage,
    removeLocalStorage,
    clearLocalStorage,
} from "@src/lib/tools";
// import { arrayify } from "ethers/lib/utils";
// import {
//     ecsign,
//     toRpcSig,
//     keccak256 as keccak256_buffer,
// } from "ethereumjs-util";

export default class KeyStore {
    private static instance: KeyStore;

    private web3: Web3;

    private _privateKey: string | null = null;

    private constructor() {
        this.web3 = new Web3();
    }

    public static getInstance() {
        if (!KeyStore.instance) {
            KeyStore.instance = new KeyStore();
        }
        return KeyStore.instance;
    }

    private get keyStoreKey(): string {
        return "soul-wallet-keystore-key";
    }

    /**
     * get the EOA address
     * @returns EOA address, null is failed or no keystore
     */
    public async getAddress(): Promise<string> {
        const val = await getLocalStorage(this.keyStoreKey);
        if (val && val.address) {
            return this.web3.utils.toChecksumAddress(val.address);
        }
        return "";
    }

    /**
     * create a new keystore and delete the old
     * @param password
     * @returns EOA address, null is failed
     */
    public async createNewAddress(
        password: string,
        saveKey: boolean,
    ): Promise<string> {
        try {
            const account = this.web3.eth.accounts.create();
            const KeystoreV3 = this.web3.eth.accounts.encrypt(
                account.privateKey,
                password,
            );
            if (saveKey) {
                await setLocalStorage(this.keyStoreKey, KeystoreV3);
                await setSessionStorage("pw", password);
            } else {
                await setLocalStorage("stagingAccount", account.address);
                await setLocalStorage("stagingKeystore", KeystoreV3);
                await setSessionStorage("stagingPw", password);
            }
            return account.address;
        } catch (error) {
            return "";
        }
    }

    public async replaceAddress(): Promise<void> {
        const stagingKeystore = await getLocalStorage("stagingKeystore");
        const stagingPw = await getLocalStorage("stagingPw");
        await clearLocalStorage();
        await setLocalStorage(this.keyStoreKey, stagingKeystore);
        await setLocalStorage("pw", stagingPw);

        // // TODO, remove all localstorage
        // await removeLocalStorage("stagingAccount");
        // await removeLocalStorage("stagingKeystore");
        // await removeLocalStorage("stagingPw");
        // await removeLocalStorage("guardianNameMapping");
    }

    public async unlock(password: string): Promise<string | null> {
        if (await this.getAddress()) {
            const val = await getLocalStorage(this.keyStoreKey);
            if (val && val.address && val.crypto) {
                const account = this.web3.eth.accounts.decrypt(val, password);
                this._privateKey = account.privateKey;
                await setSessionStorage("pw", password);
                return account.address;
            }
        }
        return null;
    }

    public async lock(): Promise<void> {
        this._privateKey = null;
        await removeSessionStorage("pw");
    }

    public async delete(): Promise<void> {
        this._privateKey = null;
        // TODO, remove all localstorage
        // await removeLocalStorage(this.keyStoreKey);
        // await removeSessionStorage("pw");
        // await removeLocalStorage("stagingAccount");
        // await removeLocalStorage("stagingKeystore");
        // await removeLocalStorage("stagingPw");
        // await removeLocalStorage("guardianNameMapping");
        await clearLocalStorage();
    }

    /**
     * get password set by user
     */
    public async getPassword(): Promise<string> {
        return await getSessionStorage("pw");
    }

    /**
     * check if user is locked
     */
    public async checkLocked(): Promise<string> {
        return (
            !(await this.getPassword()) &&
            (await getLocalStorage(this.keyStoreKey))
        );
    }

    /**
     * sign a message
     * @param message
     * @returns signature, null is failed or keystore not unlocked
     */
    public async sign(message: string): Promise<string | null> {
        if (!this._privateKey) {
            return null;
        }
        const web3 = new Web3();

        // const sig = web3.eth.accounts.sign(message, _privateKey);
        const sig = web3.eth.accounts.sign(message, this._privateKey);

        return sig.signature;
    }
}
