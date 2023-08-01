import { ethers } from "ethers";
import Web3 from "web3";
import config from "@src/config";
import { getMessageType } from "@src/lib/tools";
import { SoulWalletLib } from "soul-wallet-lib";
import browser from 'webextension-polyfill'
import bgBus from "./bgBus";
import { TypedDataUtils } from "@metamask/eth-sig-util";

const soulWalletLib = new SoulWalletLib(config.contracts.create2Factory);

const web3 = new Web3();

import {
    setLocalStorage,
    getLocalStorage,
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
            return ethers.getAddress(val.address);
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
                await browser.runtime.sendMessage({
                    target: "soul",
                    type: 'set/password',
                    data: password,
                });
            } else {
                await setLocalStorage("stagingAccount", account.address);
                await setLocalStorage("stagingKeystore", KeystoreV3);
                await setLocalStorage("stagingPw", password);
            }
            return account.address;
        } catch (error) {
            console.log('error', error)
            return "";
        }
    }

    public async replaceAddress(): Promise<void> {
        const stagingKeystore = await getLocalStorage("stagingKeystore");
        const stagingPw = await getLocalStorage("stagingPw");
        await removeLocalStorage("stagingAccount");
        await removeLocalStorage("recoverOpHash");
        await setLocalStorage(this.keyStoreKey, stagingKeystore);
        browser.runtime.sendMessage({
            target: 'soul',
            type: 'set/password',
            data: stagingPw,
        });
        // await setSessionStorage("pw", stagingPw);
    }

    public async unlock(password: string): Promise<string | null> {
        if (await this.getAddress()) {
            const val = await getLocalStorage(this.keyStoreKey);
            if (val && val.address && val.crypto) {
                const account = web3.eth.accounts.decrypt(val, password);

                this._privateKey = account.privateKey;

                browser.runtime.sendMessage({
                    target: 'soul',
                    type: 'set/password',
                    data: password,
                });
                return account.address;
            }
        }
        return null;
    }

    public async lock(): Promise<void> {
        this._privateKey = null;
        browser.runtime.sendMessage({
            target: 'soul',
            type: 'set/password',
            data: null,
        });
    }

    public async changePassword(originalPassword: string, newPassword: string): Promise<void> {
        const val = await getLocalStorage(this.keyStoreKey);
        if (val && val.address && val.crypto) {
            const account = await web3.eth.accounts.decrypt(val, originalPassword);

            const KeystoreV3 = account.encrypt(newPassword);

            await setLocalStorage(this.keyStoreKey, KeystoreV3);

            browser.runtime.sendMessage({
                target: 'soul',
                type: 'set/password',
                data: newPassword,
            });
            // await setSessionStorage("pw", newPassword);
        }
    }

    public async delete(): Promise<void> {
        this._privateKey = null;
        await clearLocalStorage();
    }

    /**
     * get password set by user
     */
    public async getPassword(): Promise<any> {
        return await bgBus.send('get/password')
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

        return await signer.signMessage(ethers.getBytes(hash));
    }

    /**
     * sign a message
     * @param message
     * @returns signature, null is failed or keystore not unlocked
     */
    public async signMessage(message: string): Promise<string | null | undefined> {
        if (!this._privateKey) {
            return null;
        }

        let signHash = null;

        if (getMessageType(message) === "hash") {
            signHash = message;
        } else {
            signHash = ethers.keccak256(ethers.toUtf8Bytes(message));

            const buf: any = Buffer.from(message, "utf-8");
            // const signHash2 = web3.keccak256(buf);

            const signHash4 = ethers.hashMessage(message);

            console.log('msg', message)
            console.log('hash is', signHash4)

            const prefix = Buffer.from("\x19Ethereum Signed Message:\n");
            const msg = Buffer.concat([prefix, Buffer.from(String(message.length)), Buffer.from(message)]);
            const signHash5 = web3.utils.keccak256(msg as any);

            const signHash6 = web3.eth.accounts.hashMessage(message)

            console.log("111111111", signHash, signHash4, signHash5, signHash6);

            const packedSignature = await this.getPackedSignature(signHash4);

            console.log('packed signature', packedSignature)

            return packedSignature;
        }
    }

    /**
     * sign a typed data
     * @param typedData
     * @returns signature, null is failed or keystore not unlocked
     */
    public async signMessageV4(typedData: any): Promise<string | null | undefined> {
        if (!this._privateKey) {
            return null;
        }
        const signBuffer = TypedDataUtils.eip712Hash(typedData as any, "V4" as any);

        console.log("sign buf", signBuffer);

        const signHash = `0x${Buffer.from(signBuffer).toString("hex")}`;

        return await this.getPackedSignature(signHash);
    }

    public async getPackedSignature(hashMsg: any) {
        const ownerAddress = await this.getAddress();
        const packedHash = soulWalletLib.EIP1271.packHashMessageWithTimeRange(hashMsg, ownerAddress);
        const signature = await this.sign(packedHash);
        if (signature) {
            return soulWalletLib.EIP1271.encodeSignature(ownerAddress, signature);
        }
    }
}
