/*
 * @Description: keystore class
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-31 20:05:46
 * @LastEditors: cejay
 * @LastEditTime: 2022-08-31 20:34:16
 */

import Web3 from "web3";
import { setLocalStorage, getLocalStorage, removeSessionStorage, getSessionStorage, setSessionStorage, removeLocalStorage } from "@src/lib/tools";
import { arrayify } from 'ethers/lib/utils'
import { ecsign, toRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'

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
        return 'soul-wallet-keystore-key';
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
        return '';
    }

    /**
     * create a new keystore and delete the old
     * @param password 
     * @returns EOA address, null is failed
     */
    public async createNewAddress(password: string): Promise<string> {
        try {
            const account = this.web3.eth.accounts.create();
            const KeystoreV3 = this.web3.eth.accounts.encrypt(account.privateKey, password);
            await setLocalStorage(this.keyStoreKey, KeystoreV3);
            await setSessionStorage('pw', password);
            return account.address;
        } catch (error) {
            return '';
        }
    }

    public async unlock(password: string): Promise<string | null> {
        if (await this.getAddress()) {
            const val = await getLocalStorage(this.keyStoreKey);
            if (val && val.address && val.crypto) {
                const account = this.web3.eth.accounts.decrypt(val, password);
                this._privateKey = account.privateKey;
                await setSessionStorage('pw', password);
                return account.address;
            }
        }
        return null;
    }

    public async lock(): Promise<void> {
        this._privateKey = null;
        await removeSessionStorage('pw');
    }

    public async delete(): Promise<void> {
        this._privateKey = null;
        await removeLocalStorage(this.keyStoreKey);
        await removeSessionStorage('pw');
    }

    /**
     * get password set by user
     */
    public async getPassword(): Promise<string> {
        return await getSessionStorage('pw');
    }

    /** 
     * check if user is locked
     */
    public async checkLocked(): Promise<string> {
        return !(await this.getPassword()) && await getLocalStorage(this.keyStoreKey);
    }

    /**
     * sign a message
     * @param message 
     * @returns signature, null is failed or keystore not unlocked
     */
    public async sign(message: string, _privateKey: string | null): Promise<string | null> {
        if (!_privateKey) {
            return null;
        }
        const msg = Buffer.concat([
            Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
            Buffer.from(arrayify(message))
        ])
        console.log('before private key', _privateKey)
        const sig = ecsign(keccak256_buffer(msg), Buffer.from(arrayify(_privateKey)))
        const signedMessage = toRpcSig(sig.v, sig.r, sig.s);
        return signedMessage;
    }

    /**
     * generate sign function
     * @param message 
     * @returns sign function
     */
        public async generateSign() {
            if (!this._privateKey) {
                return null;
            }

            return async(message: string):Promise<any> => {
                // console.log('got', _privateKey)
                this.sign(message, this._privateKey)
            }

        }
}
