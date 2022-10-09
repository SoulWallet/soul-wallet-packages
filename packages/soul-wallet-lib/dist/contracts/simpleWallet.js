"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 21:13:10
 * @LastEditors: cejay
 * @LastEditTime: 2022-10-09 11:05:39
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleWalletContract = void 0;
const ABI = [
    {
        "inputs": [
            {
                "internalType": "contract EntryPoint",
                "name": "anEntryPoint",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "anOwner",
                "type": "address"
            },
            {
                "internalType": "contract IERC20",
                "name": "token",
                "type": "address"
            },
            {
                "internalType": "address",
                "name": "paymaster",
                "type": "address"
            }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "oldEntryPoint",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "newEntryPoint",
                "type": "address"
            }
        ],
        "name": "EntryPointChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "enum SmartWallet.PendingRequestType",
                "name": "pendingRequestType",
                "type": "uint8"
            },
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "effectiveAt",
                "type": "uint256"
            }
        ],
        "name": "PendingRequestEvent",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "previousAdminRole",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "newAdminRole",
                "type": "bytes32"
            }
        ],
        "name": "RoleAdminChanged",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleGranted",
        "type": "event"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": true,
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "account",
                "type": "address"
            },
            {
                "indexed": true,
                "internalType": "address",
                "name": "sender",
                "type": "address"
            }
        ],
        "name": "RoleRevoked",
        "type": "event"
    },
    {
        "inputs": [],
        "name": "DEFAULT_ADMIN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "GUARDIAN_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "OWNER_ROLE",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "addDeposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "deleteGuardianRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "entryPoint",
        "outputs": [
            {
                "internalType": "contract EntryPoint",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "dest",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "func",
                "type": "bytes"
            }
        ],
        "name": "exec",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address[]",
                "name": "dest",
                "type": "address[]"
            },
            {
                "internalType": "bytes[]",
                "name": "func",
                "type": "bytes[]"
            }
        ],
        "name": "execBatch",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "dest",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "value",
                "type": "uint256"
            },
            {
                "internalType": "bytes",
                "name": "func",
                "type": "bytes"
            }
        ],
        "name": "execFromEntryPoint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getDeposit",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getGuardian",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getGuardiansCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getMinGuardiansSignatures",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getOwner",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getOwnersCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleAdmin",
        "outputs": [
            {
                "internalType": "bytes32",
                "name": "",
                "type": "bytes32"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "index",
                "type": "uint256"
            }
        ],
        "name": "getRoleMember",
        "outputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            }
        ],
        "name": "getRoleMemberCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantGuardianConfirmation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantGuardianRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "grantRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "guardianDelay",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "hasRole",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isGuardian",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "isOwner",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "hash",
                "type": "bytes32"
            },
            {
                "internalType": "bytes",
                "name": "signature",
                "type": "bytes"
            }
        ],
        "name": "isValidSignature",
        "outputs": [
            {
                "internalType": "bytes4",
                "name": "",
                "type": "bytes4"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "nonce",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "",
                "type": "address"
            }
        ],
        "name": "pendingGuardian",
        "outputs": [
            {
                "internalType": "enum SmartWallet.PendingRequestType",
                "name": "pendingRequestType",
                "type": "uint8"
            },
            {
                "internalType": "uint256",
                "name": "effectiveAt",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "renounceRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeGuardianConfirmation",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeGuardianRequest",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes32",
                "name": "role",
                "type": "bytes32"
            },
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "revokeRole",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "bytes4",
                "name": "interfaceId",
                "type": "bytes4"
            }
        ],
        "name": "supportsInterface",
        "outputs": [
            {
                "internalType": "bool",
                "name": "",
                "type": "bool"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "dest",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "transfer",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "account",
                "type": "address"
            }
        ],
        "name": "transferOwner",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address",
                "name": "newEntryPoint",
                "type": "address"
            }
        ],
        "name": "updateEntryPoint",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "components": [
                    {
                        "internalType": "address",
                        "name": "sender",
                        "type": "address"
                    },
                    {
                        "internalType": "uint256",
                        "name": "nonce",
                        "type": "uint256"
                    },
                    {
                        "internalType": "bytes",
                        "name": "initCode",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "callData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "uint256",
                        "name": "callGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "verificationGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "preVerificationGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxFeePerGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "uint256",
                        "name": "maxPriorityFeePerGas",
                        "type": "uint256"
                    },
                    {
                        "internalType": "address",
                        "name": "paymaster",
                        "type": "address"
                    },
                    {
                        "internalType": "bytes",
                        "name": "paymasterData",
                        "type": "bytes"
                    },
                    {
                        "internalType": "bytes",
                        "name": "signature",
                        "type": "bytes"
                    }
                ],
                "internalType": "struct UserOperation",
                "name": "userOp",
                "type": "tuple"
            },
            {
                "internalType": "bytes32",
                "name": "requestId",
                "type": "bytes32"
            },
            {
                "internalType": "uint256",
                "name": "missingWalletFunds",
                "type": "uint256"
            }
        ],
        "name": "validateUserOp",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            {
                "internalType": "address payable",
                "name": "withdrawAddress",
                "type": "address"
            },
            {
                "internalType": "uint256",
                "name": "amount",
                "type": "uint256"
            }
        ],
        "name": "withdrawDepositTo",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "stateMutability": "payable",
        "type": "receive"
    }
];
const bytecode = '0x608060405260016003553480156200001657600080fd5b5060405162003dbc38038062003dbc833981016040819052620000399162000372565b600480546001600160a01b038087166c01000000000000000000000000026001600160601b03909216919091179091558316620000bc5760405162461bcd60e51b815260206004820152601960248201527f41434c3a204f776e65722063616e6e6f74206265207a65726f00000000000000604482015260640160405180910390fd5b620000d760008051602062003d9c83398151915280620001b8565b620000f260008051602062003d9c8339815191528462000203565b6200012d7f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504160008051602062003d9c833981519152620001b8565b60405163095ea7b360e01b81526001600160a01b038281166004830152600019602483015283169063095ea7b3906044016020604051808303816000875af11580156200017e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001a49190620003da565b620001ae57600080fd5b5050505062000405565b600082815260208190526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b6200021a82826200024660201b6200199b1760201c565b60008281526001602090815260409091206200024191839062001a8b620002e7821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620002e3576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620002a23390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000620002fe836001600160a01b03841662000307565b90505b92915050565b6000818152600183016020526040812054620003505750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915562000301565b50600062000301565b6001600160a01b03811681146200036f57600080fd5b50565b600080600080608085870312156200038957600080fd5b8451620003968162000359565b6020860151909450620003a98162000359565b6040860151909350620003bc8162000359565b6060860151909250620003cf8162000359565b939692955090935050565b600060208284031215620003ed57600080fd5b81518015158114620003fe57600080fd5b9392505050565b61398780620004156000396000f3fe6080604052600436106102895760003560e01c806380c5c7d011610153578063b18c2420116100cb578063d0cb75fa1161007f578063e58378bb11610064578063e58378bb146107b2578063e6268114146107e6578063fcbac1f41461080657600080fd5b8063d0cb75fa14610772578063d547741f1461079257600080fd5b8063c41a360a116100b0578063c41a360a14610712578063c8a5b98e14610732578063ca15c8731461075257600080fd5b8063b18c2420146106e8578063c399ec88146106fd57600080fd5b8063a217fddf11610122578063aaf9bbd611610107578063aaf9bbd61461066a578063affed0e01461068a578063b0d691fe146106ad57600080fd5b8063a217fddf14610635578063a9059cbb1461064a57600080fd5b806380c5c7d014610584578063891dc430146105a45780639010d07c146105c457806391d14854146105e457600080fd5b80632f54bf6e116102015780634cc499d7116101b55780634fb2e45d1161019a5780634fb2e45d1461052f57806373ff81cc1461054f57806379f2d7c31461056457600080fd5b80634cc499d7146104ca5780634d44560d1461050f57600080fd5b8063370c3089116101e6578063370c3089146104655780633b0a68751461047a5780634a58db19146104c257600080fd5b80632f54bf6e1461042557806336568abe1461044557600080fd5b80631626ba7e11610258578063248a9ca31161023d578063248a9ca3146103a157806324ea54f4146103d15780632f2ff15d1461040557600080fd5b80631626ba7e146103305780631b71bb6e1461038157600080fd5b806301ffc9a7146102955780630565bb67146102ca5780630c68ba21146102ec578063140d075a1461030c57600080fd5b3661029057005b600080fd5b3480156102a157600080fd5b506102b56102b0366004612f98565b610826565b60405190151581526020015b60405180910390f35b3480156102d657600080fd5b506102ea6102e5366004612ffc565b610882565b005b3480156102f857600080fd5b506102b5610307366004613085565b6108d1565b34801561031857600080fd5b5061032260035481565b6040519081526020016102c1565b34801561033c57600080fd5b5061035061034b36600461318f565b61091e565b6040517fffffffff0000000000000000000000000000000000000000000000000000000090911681526020016102c1565b34801561038d57600080fd5b506102ea61039c366004613085565b6109a6565b3480156103ad57600080fd5b506103226103bc366004613219565b60009081526020819052604090206001015490565b3480156103dd57600080fd5b506103227f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504181565b34801561041157600080fd5b506102ea610420366004613232565b6109ba565b34801561043157600080fd5b506102b5610440366004613085565b6109e4565b34801561045157600080fd5b506102ea610460366004613232565b610a31565b34801561047157600080fd5b50610322610aca565b34801561048657600080fd5b506104b4610495366004613085565b6002602052600090815260409020805460019091015460ff9091169082565b6040516102c1929190613291565b6102ea610afa565b3480156104d657600080fd5b506104ea6104e5366004613219565b610b77565b60405173ffffffffffffffffffffffffffffffffffffffff90911681526020016102c1565b34801561051b57600080fd5b506102ea61052a3660046132d6565b610ba3565b34801561053b57600080fd5b506102ea61054a366004613085565b610c62565b34801561055b57600080fd5b50610322610de6565b34801561057057600080fd5b506102ea61057f366004613085565b610e11565b34801561059057600080fd5b506102ea61059f366004612ffc565b611001565b3480156105b057600080fd5b506102ea6105bf366004613085565b6110a4565b3480156105d057600080fd5b506104ea6105df366004613302565b611272565b3480156105f057600080fd5b506102b56105ff366004613232565b60009182526020828152604080842073ffffffffffffffffffffffffffffffffffffffff93909316845291905290205460ff1690565b34801561064157600080fd5b50610322600081565b34801561065657600080fd5b506102ea6106653660046132d6565b611291565b34801561067657600080fd5b506102ea610685366004613085565b6112dc565b34801561069657600080fd5b506004546bffffffffffffffffffffffff16610322565b3480156106b957600080fd5b506004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff166104ea565b3480156106f457600080fd5b50610322611426565b34801561070957600080fd5b5061032261143a565b34801561071e57600080fd5b506104ea61072d366004613219565b6114f6565b34801561073e57600080fd5b506102ea61074d366004613085565b611522565b34801561075e57600080fd5b5061032261076d366004613219565b611672565b34801561077e57600080fd5b506102ea61078d366004613369565b611689565b34801561079e57600080fd5b506102ea6107ad366004613232565b61178e565b3480156107be57600080fd5b506103227fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e81565b3480156107f257600080fd5b506102ea610801366004613085565b6117b3565b34801561081257600080fd5b506102ea6108213660046133d5565b611961565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f5a05180f00000000000000000000000000000000000000000000000000000000148061087c575061087c82611aad565b92915050565b61088a611b44565b6108cb848484848080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611bce92505050565b50505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081527f8a40f0b47fdc2a0ce293b772acfc7508c8315a4d462786c1adc3a56f92ca2d05602052604081205460ff1661087c565b600061092d6104408484611c4b565b61097e5760405162461bcd60e51b815260206004820152601660248201527f41434c3a20496e76616c6964207369676e61747572650000000000000000000060448201526064015b60405180910390fd5b507f1626ba7e0000000000000000000000000000000000000000000000000000000092915050565b6109ae611c6f565b6109b781611c77565b50565b6000828152602081905260409020600101546109d581611d11565b6109df8383611d1b565b505050565b73ffffffffffffffffffffffffffffffffffffffff811660009081527fd329ff8a035c3ce5df2b0dae604d660c0d8783bf7e64be00c1d10db96c0b87b4602052604081205460ff1661087c565b73ffffffffffffffffffffffffffffffffffffffff81163314610abc5760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152608401610975565b610ac68282611d3d565b5050565b6000610af57f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a5041611672565b905090565b6004546040516000916c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff169034908381818185875af1925050503d8060008114610b64576040519150601f19603f3d011682016040523d82523d6000602084013e610b69565b606091505b50509050806109b757600080fd5b600061087c7f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504183611272565b610bab611b44565b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff166040517f205c287800000000000000000000000000000000000000000000000000000000815273ffffffffffffffffffffffffffffffffffffffff848116600483015260248201849052919091169063205c287890604401600060405180830381600087803b158015610c4657600080fd5b505af1158015610c5a573d6000803e3d6000fd5b505050505050565b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610d055760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610975565b73ffffffffffffffffffffffffffffffffffffffff8116610d685760405162461bcd60e51b815260206004820152601960248201527f41434c3a204f776e65722063616e6e6f74206265207a65726f000000000000006044820152606401610975565b610dbc7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e610db77fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e6000611272565b611d3d565b6109b77fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e82611d1b565b6000610af57fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e611672565b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614610eb45760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610975565b610ebd816109e4565b15610f0a5760405162461bcd60e51b815260206004820152601d60248201527f41434c3a204f776e65722063616e6e6f7420626520677561726469616e0000006044820152606401610975565b600060035442610f1a9190613458565b6040805180820182526001808252602080830185905273ffffffffffffffffffffffffffffffffffffffff8716600090815260029182905293909320825181549596509294909384927fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0090921691908490811115610f9a57610f9a613262565b0217905550602091909101516001918201555b8273ffffffffffffffffffffffffffffffffffffffff167f1d48b67e05d67e03248ab2d9cec0c742d42363adbc05c97aa861c18fbf10485d83604051610ff591815260200190565b60405180910390a35050565b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461088a5760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610975565b6110ad816109e4565b156110fa5760405162461bcd60e51b815260206004820152601d60248201527f41434c3a204f776e65722063616e6e6f7420626520677561726469616e0000006044820152606401610975565b600173ffffffffffffffffffffffffffffffffffffffff821660009081526002602081905260409091205460ff169081111561113857611138613262565b146111855760405162461bcd60e51b815260206004820152601e60248201527f61646420677561726469616e2072657175657374206e6f7420657869737400006044820152606401610975565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090206001015442116111fc5760405162461bcd60e51b815260206004820152601360248201527f74696d652064656c6179206e6f742070617373000000000000000000000000006044820152606401610975565b6112267f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504182611d1b565b73ffffffffffffffffffffffffffffffffffffffff16600090815260026020526040902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055565b600082815260016020526040812061128a9083611d5f565b9392505050565b611299611b44565b60405173ffffffffffffffffffffffffffffffffffffffff83169082156108fc029083906000818181858888f193505050501580156109df573d6000803e3d6000fd5b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff161461137f5760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610975565b60006003544261138f9190613458565b6040805180820182526002808252602080830185905273ffffffffffffffffffffffffffffffffffffffff871660009081529082905292909220815181549495509193909283917fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff001690600190849081111561140d5761140d613262565b0217905550602091909101516001909101556002610fad565b6000610af5611433610aca565b6002611d6b565b6004546000906c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff166040517f70a0823100000000000000000000000000000000000000000000000000000000815230600482015273ffffffffffffffffffffffffffffffffffffffff91909116906370a0823190602401602060405180830381865afa1580156114d2573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610af5919061346b565b600061087c7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e83611272565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602081905260409091205460ff168181111561155e5761155e613262565b146115d15760405162461bcd60e51b815260206004820152602160248201527f7265766f6b6520677561726469616e2072657175657374206e6f74206578697360448201527f74000000000000000000000000000000000000000000000000000000000000006064820152608401610975565b73ffffffffffffffffffffffffffffffffffffffff811660009081526002602052604090206001015442116116485760405162461bcd60e51b815260206004820152601360248201527f74696d652064656c6179206e6f742070617373000000000000000000000000006044820152606401610975565b6112267f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504182611d3d565b600081815260016020526040812061087c90611da2565b611691611b44565b8281146116e05760405162461bcd60e51b815260206004820152601360248201527f77726f6e67206172726179206c656e67746873000000000000000000000000006044820152606401610975565b60005b838110156117875761177585858381811061170057611700613484565b90506020020160208101906117159190613085565b600085858581811061172957611729613484565b905060200281019061173b91906134b3565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250611bce92505050565b8061177f81613518565b9150506116e3565b5050505050565b6000828152602081905260409020600101546117a981611d11565b6109df8383611d3d565b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff16146118565760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610975565b73ffffffffffffffffffffffffffffffffffffffff8116600090815260026020819052604082205460ff169081111561189157611891613262565b036118de5760405162461bcd60e51b815260206004820152601160248201527f72657175657374206e6f742065786973740000000000000000000000000000006044820152606401610975565b73ffffffffffffffffffffffffffffffffffffffff8116600081815260026020908152604080832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00169055518281529192917f1d48b67e05d67e03248ab2d9cec0c742d42363adbc05c97aa861c18fbf10485d910160405180910390a350565b611969611dac565b6119738383611e4f565b61198060408401846134b3565b90506000036119925761199283611e8b565b6109df81611f3a565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16610ac65760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff85168452909152902080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff00166001179055611a2d3390565b73ffffffffffffffffffffffffffffffffffffffff168173ffffffffffffffffffffffffffffffffffffffff16837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b600061128a8373ffffffffffffffffffffffffffffffffffffffff8416611fa5565b60007fffffffff0000000000000000000000000000000000000000000000000000000082167f7965db0b00000000000000000000000000000000000000000000000000000000148061087c57507f01ffc9a7000000000000000000000000000000000000000000000000000000007fffffffff0000000000000000000000000000000000000000000000000000000083161461087c565b3360009081527fd329ff8a035c3ce5df2b0dae604d660c0d8783bf7e64be00c1d10db96c0b87b4602052604090205460ff1680611b8057503330145b611bcc5760405162461bcd60e51b815260206004820152600a60248201527f6f6e6c79206f776e6572000000000000000000000000000000000000000000006044820152606401610975565b565b6000808473ffffffffffffffffffffffffffffffffffffffff168484604051611bf79190613574565b60006040518083038185875af1925050503d8060008114611c34576040519150601f19603f3d011682016040523d82523d6000602084013e611c39565b606091505b50915091508161178757805160208201fd5b6000806000611c5a8585611ff4565b91509150611c6781612039565b509392505050565b611bcc611b44565b60045460405173ffffffffffffffffffffffffffffffffffffffff808416926c01000000000000000000000000900416907f450909c1478d09248269d4ad4fa8cba61ca3f50faed58c7aedefa51c7f62b83a90600090a36004805473ffffffffffffffffffffffffffffffffffffffff9092166c01000000000000000000000000026bffffffffffffffffffffffff909216919091179055565b6109b78133612225565b611d25828261199b565b60008281526001602052604090206109df9082611a8b565b611d4782826122db565b60008281526001602052604090206109df9082612392565b600061128a83836123b4565b60008215611d995781611d7f600185613590565b611d8991906135a3565b611d94906001613458565b61128a565b50600092915050565b600061087c825490565b6004546c01000000000000000000000000900473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff1614611bcc5760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610975565b6000611e5a836123de565b9050600081516001811115611e7157611e71613262565b14611e81576109df81848461243e565b6109df818361268c565b600480546020830135916bffffffffffffffffffffffff909116906000611eb1836135de565b91906101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff1602179055506bffffffffffffffffffffffff16146109b75760405162461bcd60e51b815260206004820152601560248201527f77616c6c65743a20696e76616c6964206e6f6e636500000000000000000000006044820152606401610975565b80156109b75760405160009033907fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff90849084818181858888f193505050503d8060008114611787576040519150601f19603f3d011682016040523d82523d6000602084013e611787565b6000818152600183016020526040812054611fec5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561087c565b50600061087c565b600080825160410361202a5760208301516040840151606085015160001a61201e87828585612718565b94509450505050612032565b506000905060025b9250929050565b600081600481111561204d5761204d613262565b036120555750565b600181600481111561206957612069613262565b036120b65760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610975565b60028160048111156120ca576120ca613262565b036121175760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610975565b600381600481111561212b5761212b613262565b0361219e5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610975565b60048160048111156121b2576121b2613262565b036109b75760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610975565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff16610ac65761227b8173ffffffffffffffffffffffffffffffffffffffff166014612830565b612286836020612830565b604051602001612297929190613609565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529082905262461bcd60e51b8252610975916004016136d4565b60008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516845290915290205460ff1615610ac65760008281526020818152604080832073ffffffffffffffffffffffffffffffffffffffff8516808552925280832080547fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0016905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b600061128a8373ffffffffffffffffffffffffffffffffffffffff8416612a59565b60008260000182815481106123cb576123cb613484565b9060005260206000200154905092915050565b60408051808201909152600081526060602082015261087c6124046101608401846134b3565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612b4c92505050565b6000612448610aca565b116124955760405162461bcd60e51b815260206004820152601c60248201527f57616c6c65743a204e6f20677561726469616e7320616c6c6f776564000000006044820152606401610975565b61249e82612ba9565b6124ea5760405162461bcd60e51b815260206004820152601f60248201527f57616c6c65743a20496e76616c696420677561726469616e20616374696f6e006044820152606401610975565b6124f2611426565b83602001515110156125465760405162461bcd60e51b815260206004820152601e60248201527f57616c6c65743a20496e73756666696369656e7420677561726469616e7300006044820152606401610975565b600080805b856020015151811015610c5a5760008660200151828151811061257057612570613484565b602002602001015190506125e381600001516125d9876040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b8360200151612c13565b8051925073ffffffffffffffffffffffffffffffffffffffff808516908416116126755760405162461bcd60e51b815260206004820152602160248201527f496e76616c696420677561726469616e20616464726573732070726f7669646560448201527f64000000000000000000000000000000000000000000000000000000000000006064820152608401610975565b82935050808061268490613518565b91505061254b565b600082602001516000815181106126a5576126a5613484565b602002602001015190506109df816000015161270e846040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b8360200151612cbf565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a083111561274f5750600090506003612827565b8460ff16601b1415801561276757508460ff16601c14155b156127785750600090506004612827565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa1580156127cc573d6000803e3d6000fd5b50506040517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0015191505073ffffffffffffffffffffffffffffffffffffffff811661282057600060019250925050612827565b9150600090505b94509492505050565b6060600061283f8360026136e7565b61284a906002613458565b67ffffffffffffffff811115612862576128626130a2565b6040519080825280601f01601f19166020018201604052801561288c576020820181803683370190505b5090507f3000000000000000000000000000000000000000000000000000000000000000816000815181106128c3576128c3613484565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f78000000000000000000000000000000000000000000000000000000000000008160018151811061292657612926613484565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060006129628460026136e7565b61296d906001613458565b90505b6001811115612a0a577f303132333435363738396162636465660000000000000000000000000000000085600f16601081106129ae576129ae613484565b1a60f81b8282815181106129c4576129c4613484565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c93612a03816136fe565b9050612970565b50831561128a5760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610975565b60008181526001830160205260408120548015612b42576000612a7d600183613590565b8554909150600090612a9190600190613590565b9050818114612af6576000866000018281548110612ab157612ab1613484565b9060005260206000200154905080876000018481548110612ad457612ad4613484565b6000918252602080832090910192909255918252600188019052604090208390555b8554869080612b0757612b07613733565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061087c565b600091505061087c565b60408051808201909152600081526060602082015260008083806020019051810190612b789190613762565b915091506040518060400160405280836001811115612b9957612b99613262565b8152602001919091529392505050565b6000612bb860608301836134b3565b9050600003612bc957506000919050565b61087c612bd960608401846134b3565b8080601f016020809104026020016040519081016040528093929190818152602001838380828437600092019190915250612d6b92505050565b612c1e838383612dc0565b612c6a5760405162461bcd60e51b815260206004820152601960248201527f41434c3a20496e76616c696420677561726469616e20736967000000000000006044820152606401610975565b612c73836108d1565b6109df5760405162461bcd60e51b815260206004820152601a60248201527f41434c3a205369676e6572206e6f74206120677561726469616e0000000000006044820152606401610975565b612cca838383612dc0565b612d165760405162461bcd60e51b815260206004820152601660248201527f41434c3a20496e76616c6964206f776e657220736967000000000000000000006044820152606401610975565b612d1f836109e4565b6109df5760405162461bcd60e51b815260206004820152601860248201527f41434c3a205369676e6572206e6f7420616e206f776e657200000000000000006044820152606401610975565b60007f4fb2e45d00000000000000000000000000000000000000000000000000000000612d9783612f8d565b7fffffffff00000000000000000000000000000000000000000000000000000000161492915050565b6000806000612dcf8585611ff4565b90925090506000816004811115612de857612de8613262565b148015612e2057508573ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff16145b15612e305760019250505061128a565b6000808773ffffffffffffffffffffffffffffffffffffffff16631626ba7e60e01b8888604051602401612e659291906138e0565b604080517fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe08184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff167fffffffff00000000000000000000000000000000000000000000000000000000909416939093179092529051612eee9190613574565b600060405180830381855afa9150503d8060008114612f29576040519150601f19603f3d011682016040523d82523d6000602084013e612f2e565b606091505b5091509150818015612f41575080516020145b8015612f81575080517f1626ba7e0000000000000000000000000000000000000000000000000000000090612f7f908301602090810190840161346b565b145b98975050505050505050565b600061087c82613901565b600060208284031215612faa57600080fd5b81357fffffffff000000000000000000000000000000000000000000000000000000008116811461128a57600080fd5b73ffffffffffffffffffffffffffffffffffffffff811681146109b757600080fd5b6000806000806060858703121561301257600080fd5b843561301d81612fda565b935060208501359250604085013567ffffffffffffffff8082111561304157600080fd5b818701915087601f83011261305557600080fd5b81358181111561306457600080fd5b88602082850101111561307657600080fd5b95989497505060200194505050565b60006020828403121561309757600080fd5b813561128a81612fda565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052604160045260246000fd5b6040805190810167ffffffffffffffff811182821017156130f4576130f46130a2565b60405290565b604051601f82017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe016810167ffffffffffffffff81118282101715613141576131416130a2565b604052919050565b600067ffffffffffffffff821115613163576131636130a2565b50601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe01660200190565b600080604083850312156131a257600080fd5b82359150602083013567ffffffffffffffff8111156131c057600080fd5b8301601f810185136131d157600080fd5b80356131e46131df82613149565b6130fa565b8181528660208385010111156131f957600080fd5b816020840160208301376000602083830101528093505050509250929050565b60006020828403121561322b57600080fd5b5035919050565b6000806040838503121561324557600080fd5b82359150602083013561325781612fda565b809150509250929050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b60408101600384106132cc577f4e487b7100000000000000000000000000000000000000000000000000000000600052602160045260246000fd5b9281526020015290565b600080604083850312156132e957600080fd5b82356132f481612fda565b946020939093013593505050565b6000806040838503121561331557600080fd5b50508035926020909101359150565b60008083601f84011261333657600080fd5b50813567ffffffffffffffff81111561334e57600080fd5b6020830191508360208260051b850101111561203257600080fd5b6000806000806040858703121561337f57600080fd5b843567ffffffffffffffff8082111561339757600080fd5b6133a388838901613324565b909650945060208701359150808211156133bc57600080fd5b506133c987828801613324565b95989497509550505050565b6000806000606084860312156133ea57600080fd5b833567ffffffffffffffff81111561340157600080fd5b8401610180818703121561341457600080fd5b95602085013595506040909401359392505050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052601160045260246000fd5b8082018082111561087c5761087c613429565b60006020828403121561347d57600080fd5b5051919050565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603260045260246000fd5b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe18436030181126134e857600080fd5b83018035915067ffffffffffffffff82111561350357600080fd5b60200191503681900382131561203257600080fd5b60007fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff820361354957613549613429565b5060010190565b60005b8381101561356b578181015183820152602001613553565b50506000910152565b60008251613586818460208701613550565b9190910192915050565b8181038181111561087c5761087c613429565b6000826135d9577f4e487b7100000000000000000000000000000000000000000000000000000000600052601260045260246000fd5b500490565b60006bffffffffffffffffffffffff8083168181036135ff576135ff613429565b6001019392505050565b7f416363657373436f6e74726f6c3a206163636f756e7420000000000000000000815260008351613641816017850160208801613550565b7f206973206d697373696e6720726f6c6520000000000000000000000000000000601791840191820152835161367e816028840160208801613550565b01602801949350505050565b600081518084526136a2816020860160208601613550565b601f017fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0169290920160200192915050565b60208152600061128a602083018461368a565b808202811582820484141761087c5761087c613429565b60008161370d5761370d613429565b507fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff0190565b7f4e487b7100000000000000000000000000000000000000000000000000000000600052603160045260246000fd5b600080604080848603121561377657600080fd5b83516002811061378557600080fd5b8093505060208085015167ffffffffffffffff808211156137a557600080fd5b818701915087601f8301126137b957600080fd5b8151818111156137cb576137cb6130a2565b8060051b6137da8582016130fa565b918252838101850191858101908b8411156137f457600080fd5b86860192505b838310156138ce578251858111156138125760008081fd5b8601808d037fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe0018913156138465760008081fd5b61384e6130d1565b8882015161385b81612fda565b8152818a01518781111561386f5760008081fd5b8083019250508d603f8301126138855760008081fd5b888201516138956131df82613149565b8181528f8c8386010111156138aa5760008081fd5b6138b9828c83018e8701613550565b828b01525083525091860191908601906137fa565b80985050505050505050509250929050565b8281526040602082015260006138f9604083018461368a565b949350505050565b6000815160208301517fffffffff00000000000000000000000000000000000000000000000000000000808216935060048310156139495780818460040360031b1b83161693505b50505091905056fea26469706673582212202d48acd935acf96435fad60b35d01f0bbed5dd401b21b412749c1b063f683b5d64736f6c63430008110033b19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e';
const contract = {
    ABI,
    bytecode
};
exports.SimpleWalletContract = contract;
//# sourceMappingURL=simpleWallet.js.map