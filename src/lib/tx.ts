import { SoulWalletLib, IUserOpReceipt } from "soul-wallet-lib";
import { ethers } from "ethers";
// import ky from "ky";
import browser from "webextension-polyfill";
import config from "@src/config";
import { notify } from "@src/lib/tools";
import { toast } from "material-react-toastify";

const ethersProvider = new ethers.providers.JsonRpcProvider(config.provider);

const soulWalletLib = new SoulWalletLib();

export const executeTransaction = async (
    operation: any,
    tabId: any,
    bundlerUrl: string = "https://bundler-eth-goerli.soulwallets.me/rpc",
) => {
    const bundler = new soulWalletLib.Bundler(config.contracts.entryPoint, ethersProvider, bundlerUrl);

    return new Promise(async (resolve, reject) => {
        try {
            const simulateResult: any = await bundler.simulateValidation(operation);

            // IMPORTANT TODO, catch errors and return
            console.log(`SimulateValidation:`, simulateResult);

            // failed to simulate
            if (simulateResult.status && simulateResult.result) {
                console.log('error');
                toast.error(simulateResult.result.reason);
                throw Error(simulateResult.result.reason);
            }

            const bundlerEvent = bundler.sendUserOperation(operation, 1000 * 60 * 3);
            bundlerEvent.on("error", (err: any) => {
                console.log(err);
            });
            bundlerEvent.on("send", (userOpHash: string) => {
                console.log("send: " + userOpHash);
            });
            bundlerEvent.on("receipt", async (receipt: IUserOpReceipt) => {
                console.log("receipt: ", receipt);
                const txHash: string = receipt.receipt.transactionHash;
                if (tabId) {
                    browser.tabs.sendMessage(Number(tabId), {
                        target: "soul",
                        type: "response",
                        action: "signTransaction",
                        data: txHash,
                        tabId,
                    });
                }

                // TODO, what if fail, add error hint
                notify("Trsanction success", "Your transaction was confirmed on chain");

                resolve(receipt.receipt);
            });
            bundlerEvent.on("timeout", () => {
                console.log("timeout");
            });
        } catch (err) {
            notify("Error", "Failed to send to bundler");
            reject(err);
        }
    });
};
