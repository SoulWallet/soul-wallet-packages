/**
 * fork from:
 * @link https://github.com/eth-infinitism/account-abstraction/blob/develop/test/UserOp.ts
 */

import { arrayify, defaultAbiCoder, keccak256, recoverAddress } from 'ethers/lib/utils'
import { ecsign, toRpcSig, fromRpcSig, keccak256 as keccak256_buffer } from 'ethereumjs-util'
import { UserOperation } from '../entity/userOperation'
import Web3 from 'web3'
import { BigNumber } from 'ethers'
import { SimpleWalletContract } from '../contracts/simpleWallet'

function encode(typevalues: Array<{ type: string, val: any }>, forSignature: boolean): string {
  const types = typevalues.map(typevalue => typevalue.type === 'bytes' && forSignature ? 'bytes32' : typevalue.type)
  const values = typevalues.map((typevalue) => typevalue.type === 'bytes' && forSignature ? keccak256(typevalue.val) : typevalue.val)
  return defaultAbiCoder.encode(types, values)
}

export function packUserOp(op: UserOperation, forSignature = true): string {
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
    }
    let encoded = defaultAbiCoder.encode([userOpType as any], [{ ...op, signature: '0x' }])
    // remove leading word (total length) and trailing word (zero-length signature)
    encoded = '0x' + encoded.slice(66, encoded.length - 64)
    return encoded
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
  ]
  if (!forSignature) {
    // for the purpose of calculating gas cost, also hash signature
    typevalues.push({ type: 'bytes', val: op.signature })
  }
  return encode(typevalues, forSignature)
}

export function getRequestId(op: UserOperation, entryPointAddress: string, chainId: number): string {
  const userOpHash = keccak256(packUserOp(op, true))
  const enc = defaultAbiCoder.encode(
    ['bytes32', 'address', 'uint256'],
    [userOpHash, entryPointAddress, chainId])
  return keccak256(enc)
}

enum SignatureMode {
  owner = 0,
  guardians = 1
}

function _signUserOp(op: UserOperation, entryPointAddress: string, chainId: number, privateKey: string): string {
  const message = getRequestId(op, entryPointAddress, chainId)
  return _signReuestId(message, privateKey);
}

function _signReuestId(requestId: string, privateKey: string): string {
  const msg1 = Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(requestId))
  ])

  const sig = ecsign(keccak256_buffer(msg1), Buffer.from(arrayify(privateKey)))
  // that's equivalent of:  await signer.signMessage(message);
  // (but without "async"
  const signedMessage1 = toRpcSig(sig.v, sig.r, sig.s);
  return signedMessage1;
}


/**
 * sign a user operation with the given private key
 * @param op 
 * @param entryPointAddress 
 * @param chainId 
 * @param privateKey 
 * @returns signature
 */
export function signUserOp(op: UserOperation, entryPointAddress: string, chainId: number, privateKey: string): string {
  const sign = _signUserOp(op, entryPointAddress, chainId, privateKey);
  return signUserOpWithPersonalSign(new Web3().eth.accounts.privateKeyToAccount(privateKey).address, sign);
}

/**
 * sign a user operation with the requestId signature
 * @param signAddress signer address
 * @param signature the signature of the requestId
 * @returns 
 */
export function signUserOpWithPersonalSign(signAddress: string, signature: string) {
  const enc = defaultAbiCoder.encode(['uint8', 'tuple(address signer,bytes signature)[]'],
    [
      SignatureMode.owner,
      [
        {
          signer: signAddress,
          signature: signature
        }
      ]
    ]
  );
  return enc;
}

/**
 * sign a user operation with guardian signatures
 * @param requestId 
 * @param signatures 
 * @param walletAddress if web3 and walletAddress is not null, will check the signer on chain
 * @param web3 if web3 and walletAddress is not null, will check the signer on chain
 * @returns 
 */
export async function packGuardiansSignByRequestId(requestId: string, signatures: string[],
  walletAddress: string | null = null, web3: Web3 | null = null): Promise<string> {
  const msg = keccak256_buffer(Buffer.concat([
    Buffer.from('\x19Ethereum Signed Message:\n32', 'ascii'),
    Buffer.from(arrayify(requestId))
  ]));
  const signList = [];
  const signerSet = new Set();
  for (let index = 0; index < signatures.length; index++) {
    const signature = signatures[index];
    try {
      const signer = recoverAddress(msg, signature);
      if (!signerSet.has(signer)) {
        signerSet.add(signer);
        signList.push({
          signer: signer,
          signature: signature
        });
      } else {
        console.log("duplicate signer: ", signer);
      }
    } catch (error) {
      throw new Error(`invalid signature: ${signature}`);
    }
  }

  if (web3 && walletAddress) {
    // function isGuardian(address account) public view returns (bool)
    const contract = new web3.eth.Contract(SimpleWalletContract.ABI, walletAddress);
    const guardiansCount: number = parseInt(await contract.methods.getGuardiansCount().call());
    if (guardiansCount < 2) {
      throw new Error(`guardians count must >= 2`);
    }
    const minSignatureLen: number = Math.round(guardiansCount / 2);
    if (signList.length < minSignatureLen) {
      throw new Error(`signatures count must >= ${minSignatureLen}`);
    }
    for (let index = 0; index < signList.length; index++) {
      const sign = signList[index];
      const isGuardian = await contract.methods.isGuardian(sign.signer).call();
      if (!isGuardian) {
        throw new Error(`signer ${sign.signer} is not a guardian`);
      }
    }
  }

  // sort signList by bn asc
  signList.sort((a, b) => {
    return BigNumber.from(a.signer).lt(BigNumber.from(b.signer)) ? -1 : 1;
  });

  const enc = defaultAbiCoder.encode(['uint8', 'tuple(address signer,bytes signature)[]'],
    [
      SignatureMode.guardians,
      signList
    ]
  );
  return enc;
}



export function payMasterSignHash(op: UserOperation): string {
  return keccak256(defaultAbiCoder.encode([
    'address', // sender
    'uint256', // nonce
    'bytes32', // initCode
    'bytes32', // callData
    'uint256', // callGas
    'uint', // verificationGas
    'uint', // preVerificationGas
    'uint256', // maxFeePerGas
    'uint256', // maxPriorityFeePerGas
    'address', // paymaster
  ], [
    op.sender,
    op.nonce,
    keccak256(op.initCode),
    keccak256(op.callData),
    op.callGas,
    op.verificationGas,
    op.preVerificationGas,
    op.maxFeePerGas,
    op.maxPriorityFeePerGas,
    op.paymaster,
  ]))
}


