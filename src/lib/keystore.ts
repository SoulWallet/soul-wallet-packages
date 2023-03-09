/*
 * @Description: keystore class
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-31 20:05:46
 * @LastEditors: cejay
 * @LastEditTime: 2022-11-23 18:55:41
 */

import { ethers } from "ethers";
import Web3 from "web3";

const web3 = new Web3();
// import * as ethUtil from 'ethereumjs-util';

import {
    setLocalStorage,
    getLocalStorage,
    removeSessionStorage,
    getSessionStorage,
    setSessionStorage,
    // removeLocalStorage,
    clearLocalStorage,
    removeLocalStorage,
} from "@src/lib/tools";

export default class KeyStore {
    private static instance: KeyStore;
    private _privateKey: string | null = null;

    private constructor() {}

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
            return ethers.utils.getAddress(val.address);
        }
        return "";
    }

    /**
     * create a new keystore and delete the old
     * @param password
     * @returns EOA address, null is failed
     */
    public async createNewAddress(password: string, saveKey: boolean): Promise<string> {
        try {
            // TODO, ethers is much slower
            // const account = ethers.Wallet.createRandom();
            const account = web3.eth.accounts.create();

            const KeystoreV3 = account.encrypt(password);

            if (saveKey) {
                await setLocalStorage(this.keyStoreKey, KeystoreV3);
                await setSessionStorage("pw", password);
            } else {
                await setLocalStorage("stagingAccount", account.address);
                await setLocalStorage("stagingKeystore", KeystoreV3);
                await setLocalStorage("stagingPw", password);
            }
            return account.address;
        } catch (error) {
            return "";
        }
    }

    public async replaceAddress(): Promise<void> {
        const stagingKeystore = await getLocalStorage("stagingKeystore");
        const stagingPw = await getLocalStorage("stagingPw");
        await removeLocalStorage("stagingAccount");
        // await removeLocalStorage("accountsAllowed");
        await removeLocalStorage("recoverOpHash");
        // await clearLocalStorage();
        await setLocalStorage(this.keyStoreKey, stagingKeystore);
        await setSessionStorage("pw", stagingPw);
    }

    public async unlock(password: string): Promise<string | null> {
        if (await this.getAddress()) {
            const val = await getLocalStorage(this.keyStoreKey);
            if (val && val.address && val.crypto) {
                const account = await web3.eth.accounts.decrypt(val, password);

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

    public async changePassword(originalPassword: string, newPassword: string): Promise<void> {
        const val = await getLocalStorage(this.keyStoreKey);
        if (val && val.address && val.crypto) {
            const account = await web3.eth.accounts.decrypt(val, originalPassword);

            const KeystoreV3 = account.encrypt(newPassword);

            await setLocalStorage(this.keyStoreKey, KeystoreV3);
            await setSessionStorage("pw", newPassword);
        }
    }

    public async delete(): Promise<void> {
        this._privateKey = null;
        // TODO, remove all localstorage
        // await removeLocalStorage(this.keyStoreKey);
        // await removeSessionStorage("pw");
        // await removeLocalStorage("stagingAccount");
        // await removeLocalStorage("stagingKeystore");
        // await removeLocalStorage("stagingPw");
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
    public async checkLocked(): Promise<boolean> {
        const storedKeystore = await getLocalStorage(this.keyStoreKey);
        return !(await this.getPassword()) && storedKeystore && !this._privateKey;
    }

    public async getSigner(provider: any) {
        if (!this._privateKey) {
            return;
        }
        const signer = new ethers.Wallet(this._privateKey);
        return signer.connect(provider);
    }

    /**
     * sign a hash
     * @param message
     * @returns signature, null is failed or keystore not unlocked
     */
    public async sign(hash: string): Promise<string | null> {
        if (!this._privateKey) {
            return null;
        }
        // const messageHex = Buffer.from(ethers.utils.arrayify(message)).toString('hex');
        // const personalMessage = ethUtil.hashPersonalMessage(ethUtil.toBuffer(ethUtil.addHexPrefix(messageHex)));
        // var privateKey = Buffer.from(this._privateKey.substring(2), "hex");
        // const signature1 = ethUtil.ecsign(personalMessage, privateKey);
        // const sigHex = ethUtil.toRpcSig(signature1.v, signature1.r, signature1.s);
        const signer = new ethers.Wallet(this._privateKey);

        return await signer.signMessage(ethers.utils.arrayify(hash));
    }

    /**
     * sign a message
     * @param message
     * @returns signature, null is failed or keystore not unlocked
     */
    public async signMessage(message: string): Promise<string | null> {
        if (!this._privateKey) {
            return null;
        }
        // const messageHex = Buffer.from(ethers.utils.arrayify(message)).toString('hex');
        // const personalMessage = ethUtil.hashPersonalMessage(ethUtil.toBuffer(ethUtil.addHexPrefix(messageHex)));
        // var privateKey = Buffer.from(this._privateKey.substring(2), "hex");
        // const signature1 = ethUtil.ecsign(personalMessage, privateKey);
        // const sigHex = ethUtil.toRpcSig(signature1.v, signature1.r, signature1.s);
        const signer = new ethers.Wallet(this._privateKey);

        return await signer.signMessage(message);
    }

    /**
     * sign a typed data
     * @param typedData
     * @returns signature, null is failed or keystore not unlocked
     */
    public async signMessageV4(typedData: any): Promise<string | null> {
        if (!this._privateKey) {
            return null;
        }

        console.log('tttt', typedData.domain, typedData.types, typedData.value)
        // const messageHex = Buffer.from(ethers.utils.arrayify(message)).toString('hex');
        // const personalMessage = ethUtil.hashPersonalMessage(ethUtil.toBuffer(ethUtil.addHexPrefix(messageHex)));
        // var privateKey = Buffer.from(this._privateKey.substring(2), "hex");
        // const signature1 = ethUtil.ecsign(personalMessage, privateKey);
        // const sigHex = ethUtil.toRpcSig(signature1.v, signature1.r, signature1.s);
        const signer = new ethers.Wallet(this._privateKey);

        return await signer._signTypedData(typedData.domain, typedData.types, typedData.value);
    }
}
