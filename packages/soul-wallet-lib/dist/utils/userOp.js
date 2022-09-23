"use strict";
/**
 * fork from:
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.payMasterSignHash = exports.packGuardiansSignByRequestId = exports.guardianSignRequestId = exports.guardianSignUserOp = exports.guardianSignRequestIdWithKeyStore = exports.guardianSignUserOpWithKeyStore = exports.signUserOpWithKeyStore = exports.signUserOp = exports.getRequestId = exports.packUserOp = void 0;
const utils_1 = require("ethers/lib/utils");
const ethereumjs_util_1 = require("ethereumjs-util");
const web3_1 = __importDefault(require("web3"));
const ethers_1 = require("ethers");
const simpleWallet_1 = require("../contracts/simpleWallet");
function encode(typevalues, forSignature) {
    const types = typevalues.map(typevalue => typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type);
    const values = typevalues.map((typevalue) => typevalue.type === 'bytes' && forSignature ? (0, utils_1.keccak256)(typevalue.val) : typevalue.val);
    return utils_1.defaultAbiCoder.encode(types, values);
}
function packUserOp(op, forSignature = true) {
    if (forSignature) {
        // lighter signature scheme (must match UserOperation#pack): do encode a zero-length signature, but strip afterwards the appended zero-length value
        const userOpType = {
            components: [
                { type: 'address', name: 'sender' },
                { type: 'uint256', name: 'nonce' },
                { type: 'bytes', name: 'initCode' },
                { type: 'bytes', name: 'callData' },
                { type: 'uint256', name: 'callGas' },
                { type: 'uint256', name: 'verificationGas' },
                { type: 'uint256', name: 'preVerificationGas' },
                { type: 'uint256', name: 'maxFeePerGas' },
                { type: 'uint256', name: 'maxPriorityFeePerGas' },
                { type: 'address', name: 'paymaster' },
                { type: 'bytes', name: 'paymasterData' },
                { type: 'bytes', name: 'signature' }
            ],
            name: 'userOp',
            type: 'tuple'
        };
        let encoded = utils_1.defaultAbiCoder.encode([userOpType], [Object.assign(Object.assign({}, op), { signature: '0x' })]);
        // remove leading word (total length) and trailing word (zero-length signature)
        encoded = '0x' + encoded.slice(66, encoded.length - 64);
        return encoded;
    }
    const typevalues = [
        { type: 'address', val: op.sender },
        { type: 'uint256', val: op.nonce },
        { type: 'bytes', val: op.initCode },
        { type: 'bytes', val: op.callData },
        { type: 'uint256', val: op.callGas },
        { type: 'uint256', val: op.verificationGas },
        { type: 'uint256', val: op.preVerificationGas },
        { type: 'uint256', val: op.maxFeePerGas },
        { type: 'uint256', val: op.maxPriorityFeePerGas },
        { type: 'address', val: op.paymaster },
        { type: 'bytes', val: op.paymasterData }
    ];
    if (!forSignature) {
        // for the purpose of calculating gas cost, also hash signature
        typevalues.push({ type: 'bytes', val: op.signature });
    }
    return encode(typevalues, forSignature);
}
exports.packUserOp = packUserOp;
function getRequestId(op, entryPointAddress, chainId) {
    const userOpHash = (0, utils_1.keccak256)(packUserOp(op, true));
    const enc = utils_1.defaultAbiCoder.encode(['bytes32', 'address', 'uint256'], [userOpHash, entryPointAddress, chainId]);
    return (0, utils_1.keccak256)(enc);
}
exports.getRequestId = getRequestId;
var SignatureMode;
(function (SignatureMode) {
    SignatureMode[SignatureMode["owner"] = 0] = "owner";
    SignatureMode[SignatureMode["guardians"] = 1] = "guardians";
})(SignatureMode || (SignatureMode = {}));
function _signUserOp(op, entryPointAddress, chainId, privateKey) {
    const message = getRequestId(op, entryPointAddress, chainId);
    return _signReuestId(message, privateKey);
}
function _signReuestId(requestId, privateKey) {
    const msg1 = Buffer.concat([
        Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
        Buffer.from((0, utils_1.arrayify)(requestId))
    ]);
    const sig = (0, ethereumjs_util_1.ecsign)((0, ethereumjs_util_1.keccak256)(msg1), Buffer.from((0, utils_1.arrayify)(privateKey)));
    // that's equivalent of:  await signer.signMessage(message);
    // (but without "async"
    const signedMessage1 = (0, ethereumjs_util_1.toRpcSig)(sig.v, sig.r, sig.s);
    return signedMessage1;
}
function _signUserOpWithKeyStore(op, entryPointAddress, chainId, keyStoreSign) {
    return __awaiter(this, void 0, void 0, function* () {
        const message = getRequestId(op, entryPointAddress, chainId);
        return yield keyStoreSign(message);
    });
}
/**
 * sign a user operation with the given private key
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param privateKey
 * @returns signature
 */
function signUserOp(op, entryPointAddress, chainId, privateKey) {
    const sign = _signUserOp(op, entryPointAddress, chainId, privateKey);
    const enc = utils_1.defaultAbiCoder.encode(['uint8', 'tuple(address signer,bytes signature)[]'], [
        SignatureMode.owner,
        [
            {
                signer: new web3_1.default().eth.accounts.privateKeyToAccount(privateKey).address,
                signature: sign
            }
        ]
    ]);
    return enc;
}
exports.signUserOp = signUserOp;
/**
 * sign a user operation with the given private key
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param signAddress user address
 * @param keyStoreSign user sign function
 * @returns signature
 */
function signUserOpWithKeyStore(op, entryPointAddress, chainId, signAddress, keyStoreSign) {
    return __awaiter(this, void 0, void 0, function* () {
        const sign = _signUserOpWithKeyStore(op, entryPointAddress, chainId, keyStoreSign);
        const enc = utils_1.defaultAbiCoder.encode(['uint8', 'tuple(address signer,bytes signature)[]'], [
            SignatureMode.owner,
            [
                {
                    signer: signAddress,
                    signature: sign
                }
            ]
        ]);
        return enc;
    });
}
exports.signUserOpWithKeyStore = signUserOpWithKeyStore;
/**
 * guardian offline sign a user operation with the given keyStoreSign
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param signAddress
 * @param keyStoreSign
 * @returns
 */
function guardianSignUserOpWithKeyStore(op, entryPointAddress, chainId, signAddress, keyStoreSign) {
    return __awaiter(this, void 0, void 0, function* () {
        const requestId = getRequestId(op, entryPointAddress, chainId);
        return yield guardianSignRequestIdWithKeyStore(requestId, signAddress, keyStoreSign);
    });
}
exports.guardianSignUserOpWithKeyStore = guardianSignUserOpWithKeyStore;
/**
 * guardian offline sign a requestId with the given keyStoreSign
 * @param requestId
 * @param signAddress
 * @param keyStoreSign
 * @returns
 */
function guardianSignRequestIdWithKeyStore(requestId, signAddress, keyStoreSign) {
    return __awaiter(this, void 0, void 0, function* () {
        const sign = yield keyStoreSign(requestId);
        return sign;
    });
}
exports.guardianSignRequestIdWithKeyStore = guardianSignRequestIdWithKeyStore;
/**
 * guardian offline sign a user operation with the given private key
 * @param op
 * @param entryPointAddress
 * @param chainId
 * @param privateKey
 * @returns
 */
function guardianSignUserOp(op, entryPointAddress, chainId, privateKey) {
    const requestId = getRequestId(op, entryPointAddress, chainId);
    return guardianSignRequestId(requestId, privateKey);
}
exports.guardianSignUserOp = guardianSignUserOp;
/**
 * guardian offline sign a user operation with the given private key
 * @param requestId
 * @param privateKey
 * @returns
 */
function guardianSignRequestId(requestId, privateKey) {
    const sign = _signReuestId(requestId, privateKey);
    return sign;
}
exports.guardianSignRequestId = guardianSignRequestId;
/**
 * sign a user operation with guardian signatures
 * @param requestId
 * @param signatures
 * @param walletAddress if web3 and walletAddress is not null, will check the signer on chain
 * @param web3 if web3 and walletAddress is not null, will check the signer on chain
 * @returns
 */
function packGuardiansSignByRequestId(requestId, signatures, walletAddress = null, web3 = null) {
    return __awaiter(this, void 0, void 0, function* () {
        const msg = (0, ethereumjs_util_1.keccak256)(Buffer.concat([
            Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
            Buffer.from((0, utils_1.arrayify)(requestId))
        ]));
        const signList = [];
        const signerSet = new Set();
        for (let index = 0; index < signatures.length; index++) {
            const signature = signatures[index];
            try {
                const signer = (0, utils_1.recoverAddress)(msg, signature);
                if (!signerSet.has(signer)) {
                    signerSet.add(signer);
                    signList.push({
                        signer: signer,
                        signature: signature
                    });
                }
                else {
                    console.log("duplicate signer: ", signer);
                }
            }
            catch (error) {
                throw new Error(`invalid signature: ${signature}`);
            }
        }
        if (web3 && walletAddress) {
            // function isGuardian(address account) public view returns (bool)
            const contract = new web3.eth.Contract(simpleWallet_1.SimpleWalletContract.ABI, walletAddress);
            const guardiansCount = parseInt(yield contract.methods.getGuardiansCount().call());
            if (guardiansCount < 2) {
                throw new Error(`guardians count must >= 2`);
            }
            const minSignatureLen = Math.round(guardiansCount / 2);
            if (signList.length < minSignatureLen) {
                throw new Error(`signatures count must >= ${minSignatureLen}`);
            }
            for (let index = 0; index < signList.length; index++) {
                const sign = signList[index];
                const isGuardian = yield contract.methods.isGuardian(sign.signer).call();
                if (!isGuardian) {
                    throw new Error(`signer ${sign.signer} is not a guardian`);
                }
            }
        }
        // sort signList by bn asc
        signList.sort((a, b) => {
            return ethers_1.BigNumber.from(a.signer).lt(ethers_1.BigNumber.from(b.signer)) ? -1 : 1;
        });
        const enc = utils_1.defaultAbiCoder.encode(['uint8', 'tuple(address signer,bytes signature)[]'], [
            SignatureMode.guardians,
            signList
        ]);
        return enc;
    });
}
exports.packGuardiansSignByRequestId = packGuardiansSignByRequestId;
function payMasterSignHash(op) {
    return (0, utils_1.keccak256)(utils_1.defaultAbiCoder.encode([
        'address',
        'uint256',
        'bytes32',
        'bytes32',
        'uint256',
        'uint',
        'uint',
        'uint256',
        'uint256',
        'address', // paymaster
    ], [
        op.sender,
        op.nonce,
        (0, utils_1.keccak256)(op.initCode),
        (0, utils_1.keccak256)(op.callData),
        op.callGas,
        op.verificationGas,
        op.preVerificationGas,
        op.maxFeePerGas,
        op.maxPriorityFeePerGas,
        op.paymaster,
    ]));
}
exports.payMasterSignHash = payMasterSignHash;
//# sourceMappingURL=userOp.js.map