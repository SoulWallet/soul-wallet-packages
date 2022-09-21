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
exports.payMasterSignHash = exports.signUserOpWithKeyStore = exports.signUserOp = exports.getRequestId = exports.packUserOp = void 0;
const utils_1 = require("ethers/lib/utils");
const ethereumjs_util_1 = require("ethereumjs-util");
const web3_1 = __importDefault(require("web3"));
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
    const msg1 = Buffer.concat([
        Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
        Buffer.from((0, utils_1.arrayify)(message))
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