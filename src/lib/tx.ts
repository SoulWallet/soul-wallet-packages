import { SoulWallet, Bundler } from "@soulwallet/sdk";
import { notify } from "@src/lib/tools";
// import { printUserOp } from "@src/lib/tools";

let soulWallet: any = null;
let currentChainId: any = null;
let bundler: any = null;
let currentBundlerUrl: any = null;

export const initSoulWallet = (chainConfig: any) => {
    currentChainId = chainConfig.chainId;
    soulWallet = new SoulWallet(
        chainConfig.provider,
        chainConfig.bundlerUrl,
        chainConfig.contracts.soulWalletFactory,
        chainConfig.contracts.defaultCallbackHandler,
        chainConfig.contracts.keyStoreModuleProxy,
        chainConfig.contracts.securityControlModule,
    );
};

export const initBundler = (bundlerUrl: string) => {
    bundler = new Bundler(bundlerUrl);
};

export const executeTransaction = async (userOp: any, chainConfig: any) => {
    if (!soulWallet || currentChainId !== chainConfig.chainId) {
        initSoulWallet(chainConfig);
    }

    if (currentBundlerUrl !== chainConfig.bundlerUrl) {
        initBundler(chainConfig.bundlerUrl);
    }

    // printUserOp(userOp);
    return new Promise(async (resolve, reject) => {
        const ret = await soulWallet.sendUserOperation(userOp);

        if (ret.isErr()) {
            const errMsg = ret.ERR.message;
            notify("Bundler Error", errMsg);
            console.error(errMsg);
            reject(errMsg);
            return;
        }

        const userOpHashRet = await soulWallet.userOpHash(userOp);

        if (userOpHashRet.isErr()) {
            const errMsg = userOpHashRet.ERR.message;
            console.error(errMsg);
            notify("Bundler Error", errMsg);
            reject(errMsg);
            return;
        }

        const userOpHash = userOpHashRet.OK;

        notify("Transaction sent", "Your transaction was sent to bundler");

        while (true) {
            const receipt = await bundler.eth_getUserOperationReceipt(userOpHash);
            console.log("RECEIPT", receipt);
            if (receipt.isErr()) {
                const errMsg = receipt.ERR.message;
                notify("Bundler Error", errMsg);
                reject(errMsg);
            }
            if (receipt.OK === null) {
                console.log("still waiting");
                await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
                console.log("receipt is", receipt);
                if (receipt.OK.success) {
                    resolve(receipt.OK.receipt);
                } else {
                    reject("tx failed");
                }
                break;
            }
        }
    });
};
