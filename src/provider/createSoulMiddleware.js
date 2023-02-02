import { createScaffoldMiddleware, mergeMiddleware } from "json-rpc-engine";
import { createWalletMiddleware } from "eth-json-rpc-middleware";

export default function createSoulMiddleware({
    version,
    getAccounts,
    processTransaction,
    processEthSignMessage,
    processTypedMessage,
    processTypedMessageV3,
    processTypedMessageV4,
    processPersonalMessage,
    processDecryptMessage,
    processEncryptionPublicKey,
}) {
    const soulMiddleware = mergeMiddleware([
        createScaffoldMiddleware({
            eth_syncing: true,
            web3_clientVersion: `MetaMask/v${version}`,
        }),
        createWalletMiddleware({
            getAccounts,
            processTransaction,
            processEthSignMessage,
            processTypedMessage,
            processTypedMessageV3,
            processTypedMessageV4,
            processPersonalMessage,
            processDecryptMessage,
            processEncryptionPublicKey,
        }),
    ]);
    return soulMiddleware;
}
