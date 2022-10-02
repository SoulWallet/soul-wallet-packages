"use strict";
/*
 * @Description:
 * @Version: 1.0
 * @Autor: z.cejay@gmail.com
 * @Date: 2022-08-05 21:13:10
 * @LastEditors: cejay
 * @LastEditTime: 2022-10-02 11:58:34
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
const bytecode = '0x6080604052600a6003553480156200001657600080fd5b50604051620038a5380380620038a5833981016040819052620000399162000372565b600480546001600160a01b038087166c01000000000000000000000000026001600160601b03909216919091179091558316620000bc5760405162461bcd60e51b815260206004820152601960248201527f41434c3a204f776e65722063616e6e6f74206265207a65726f00000000000000604482015260640160405180910390fd5b620000d76000805160206200388583398151915280620001b8565b620000f2600080516020620038858339815191528462000203565b6200012d7f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504160008051602062003885833981519152620001b8565b60405163095ea7b360e01b81526001600160a01b038281166004830152600019602483015283169063095ea7b3906044016020604051808303816000875af11580156200017e573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190620001a49190620003da565b620001ae57600080fd5b5050505062000405565b600082815260208190526040808220600101805490849055905190918391839186917fbd79b86ffe0ab8e8776151514217cd7cacd52c909f66475c3af44e129f0b00ff9190a4505050565b6200021a82826200024660201b620016b41760201c565b60008281526001602090815260409091206200024191839062001752620002e7821b17901c565b505050565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16620002e3576000828152602081815260408083206001600160a01b03851684529091529020805460ff19166001179055620002a23390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45b5050565b6000620002fe836001600160a01b03841662000307565b90505b92915050565b6000818152600183016020526040812054620003505750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915562000301565b50600062000301565b6001600160a01b03811681146200036f57600080fd5b50565b600080600080608085870312156200038957600080fd5b8451620003968162000359565b6020860151909450620003a98162000359565b6040860151909350620003bc8162000359565b6060860151909250620003cf8162000359565b939692955090935050565b600060208284031215620003ed57600080fd5b81518015158114620003fe57600080fd5b9392505050565b61347080620004156000396000f3fe6080604052600436106102895760003560e01c806380c5c7d011610153578063b18c2420116100cb578063d0cb75fa1161007f578063e58378bb11610064578063e58378bb1461076a578063e62681141461079e578063fcbac1f4146107be57600080fd5b8063d0cb75fa1461072a578063d547741f1461074a57600080fd5b8063c41a360a116100b0578063c41a360a146106ca578063c8a5b98e146106ea578063ca15c8731461070a57600080fd5b8063b18c2420146106a0578063c399ec88146106b557600080fd5b8063a217fddf11610122578063aaf9bbd611610107578063aaf9bbd614610638578063affed0e014610658578063b0d691fe1461067b57600080fd5b8063a217fddf14610603578063a9059cbb1461061857600080fd5b806380c5c7d01461055f578063891dc4301461057f5780639010d07c1461059f57806391d14854146105bf57600080fd5b80632f54bf6e116102015780634cc499d7116101b55780634fb2e45d1161019a5780634fb2e45d1461050a57806373ff81cc1461052a57806379f2d7c31461053f57600080fd5b80634cc499d7146104b25780634d44560d146104ea57600080fd5b8063370c3089116101e6578063370c30891461044d5780633b0a6875146104625780634a58db19146104aa57600080fd5b80632f54bf6e1461040d57806336568abe1461042d57600080fd5b80631626ba7e11610258578063248a9ca31161023d578063248a9ca31461038957806324ea54f4146103b95780632f2ff15d146103ed57600080fd5b80631626ba7e146103305780631b71bb6e1461036957600080fd5b806301ffc9a7146102955780630565bb67146102ca5780630c68ba21146102ec578063140d075a1461030c57600080fd5b3661029057005b600080fd5b3480156102a157600080fd5b506102b56102b0366004612c21565b6107de565b60405190151581526020015b60405180910390f35b3480156102d657600080fd5b506102ea6102e5366004612c60565b610822565b005b3480156102f857600080fd5b506102b5610307366004612ce9565b610871565b34801561031857600080fd5b5061032260035481565b6040519081526020016102c1565b34801561033c57600080fd5b5061035061034b366004612d9e565b6108b1565b6040516001600160e01b031990911681526020016102c1565b34801561037557600080fd5b506102ea610384366004612ce9565b610939565b34801561039557600080fd5b506103226103a4366004612e28565b60009081526020819052604090206001015490565b3480156103c557600080fd5b506103227f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504181565b3480156103f957600080fd5b506102ea610408366004612e41565b61094d565b34801561041957600080fd5b506102b5610428366004612ce9565b610977565b34801561043957600080fd5b506102ea610448366004612e41565b6109b7565b34801561045957600080fd5b50610322610a43565b34801561046e57600080fd5b5061049c61047d366004612ce9565b6002602052600090815260409020805460019091015460ff9091169082565b6040516102c1929190612e87565b6102ea610a73565b3480156104be57600080fd5b506104d26104cd366004612e28565b610ada565b6040516001600160a01b0390911681526020016102c1565b3480156104f657600080fd5b506102ea610505366004612eb3565b610b06565b34801561051657600080fd5b506102ea610525366004612ce9565b610ba2565b34801561053657600080fd5b50610322610ce9565b34801561054b57600080fd5b506102ea61055a366004612ce9565b610d14565b34801561056b57600080fd5b506102ea61057a366004612c60565b610e9c565b34801561058b57600080fd5b506102ea61059a366004612ce9565b610f0f565b3480156105ab57600080fd5b506104d26105ba366004612edf565b611098565b3480156105cb57600080fd5b506102b56105da366004612e41565b6000918252602082815260408084206001600160a01b0393909316845291905290205460ff1690565b34801561060f57600080fd5b50610322600081565b34801561062457600080fd5b506102ea610633366004612eb3565b6110b7565b34801561064457600080fd5b506102ea610653366004612ce9565b6110f5565b34801561066457600080fd5b506004546bffffffffffffffffffffffff16610322565b34801561068757600080fd5b50600454600160601b90046001600160a01b03166104d2565b3480156106ac57600080fd5b506103226111e4565b3480156106c157600080fd5b506103226111f8565b3480156106d657600080fd5b506104d26106e5366004612e28565b611291565b3480156106f657600080fd5b506102ea610705366004612ce9565b6112bd565b34801561071657600080fd5b50610322610725366004612e28565b6113f3565b34801561073657600080fd5b506102ea610745366004612f46565b61140a565b34801561075657600080fd5b506102ea610765366004612e41565b61150f565b34801561077657600080fd5b506103227fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e81565b3480156107aa57600080fd5b506102ea6107b9366004612ce9565b611534565b3480156107ca57600080fd5b506102ea6107d9366004612fb2565b61167a565b60006001600160e01b031982167f5a05180f00000000000000000000000000000000000000000000000000000000148061081c575061081c82611767565b92915050565b61082a6117ce565b61086b848484848080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061185892505050565b50505050565b6001600160a01b03811660009081527f8a40f0b47fdc2a0ce293b772acfc7508c8315a4d462786c1adc3a56f92ca2d05602052604081205460ff1661081c565b60006108c061042884846118c8565b6109115760405162461bcd60e51b815260206004820152601660248201527f41434c3a20496e76616c6964207369676e61747572650000000000000000000060448201526064015b60405180910390fd5b507f1626ba7e0000000000000000000000000000000000000000000000000000000092915050565b6109416118ec565b61094a816118f4565b50565b60008281526020819052604090206001015461096881611962565b610972838361196c565b505050565b6001600160a01b03811660009081527fd329ff8a035c3ce5df2b0dae604d660c0d8783bf7e64be00c1d10db96c0b87b4602052604081205460ff1661081c565b6001600160a01b0381163314610a355760405162461bcd60e51b815260206004820152602f60248201527f416363657373436f6e74726f6c3a2063616e206f6e6c792072656e6f756e636560448201527f20726f6c657320666f722073656c6600000000000000000000000000000000006064820152608401610908565b610a3f828261198e565b5050565b6000610a6e7f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a50416113f3565b905090565b600454604051600091600160601b90046001600160a01b03169034908381818185875af1925050503d8060008114610ac7576040519150601f19603f3d011682016040523d82523d6000602084013e610acc565b606091505b505090508061094a57600080fd5b600061081c7f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a504183611098565b610b0e6117ce565b600454600160601b90046001600160a01b03166040517f205c28780000000000000000000000000000000000000000000000000000000081526001600160a01b03848116600483015260248201849052919091169063205c287890604401600060405180830381600087803b158015610b8657600080fd5b505af1158015610b9a573d6000803e3d6000fd5b505050505050565b600454600160601b90046001600160a01b03166001600160a01b0316336001600160a01b031614610c155760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610908565b6001600160a01b038116610c6b5760405162461bcd60e51b815260206004820152601960248201527f41434c3a204f776e65722063616e6e6f74206265207a65726f000000000000006044820152606401610908565b610cbf7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e610cba7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e6000611098565b61198e565b61094a7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e8261196c565b6000610a6e7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e6113f3565b600454600160601b90046001600160a01b03166001600160a01b0316336001600160a01b031614610d875760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610908565b610d9081610977565b15610ddd5760405162461bcd60e51b815260206004820152601d60248201527f41434c3a204f776e65722063616e6e6f7420626520677561726469616e0000006044820152606401610908565b600060035442610ded919061301c565b604080518082018252600180825260208083018590526001600160a01b0387166000908152600291829052939093208251815495965092949093849260ff1990921691908490811115610e4257610e42612e71565b0217905550602091909101516001918201555b826001600160a01b03167f1d48b67e05d67e03248ab2d9cec0c742d42363adbc05c97aa861c18fbf10485d83604051610e9091815260200190565b60405180910390a35050565b600454600160601b90046001600160a01b03166001600160a01b0316336001600160a01b03161461082a5760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610908565b610f1881610977565b15610f655760405162461bcd60e51b815260206004820152601d60248201527f41434c3a204f776e65722063616e6e6f7420626520677561726469616e0000006044820152606401610908565b60016001600160a01b03821660009081526002602081905260409091205460ff1690811115610f9657610f96612e71565b14610fe35760405162461bcd60e51b815260206004820152601e60248201527f61646420677561726469616e2072657175657374206e6f7420657869737400006044820152606401610908565b6001600160a01b038116600090815260026020526040902060010154421161104d5760405162461bcd60e51b815260206004820152601360248201527f74696d652064656c6179206e6f742070617373000000000000000000000000006044820152606401610908565b6110777f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a50418261196c565b6001600160a01b03166000908152600260205260409020805460ff19169055565b60008281526001602052604081206110b090836119b0565b9392505050565b6110bf6117ce565b6040516001600160a01b0383169082156108fc029083906000818181858888f19350505050158015610972573d6000803e3d6000fd5b600454600160601b90046001600160a01b03166001600160a01b0316336001600160a01b0316146111685760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610908565b600060035442611178919061301c565b604080518082018252600280825260208083018590526001600160a01b038716600090815290829052929092208151815494955091939092839160ff19169060019084908111156111cb576111cb612e71565b0217905550602091909101516001909101556002610e55565b6000610a6e6111f1610a43565b60026119bc565b600454600090600160601b90046001600160a01b03166040517f70a082310000000000000000000000000000000000000000000000000000000081523060048201526001600160a01b0391909116906370a0823190602401602060405180830381865afa15801561126d573d6000803e3d6000fd5b505050506040513d601f19601f82011682018060405250810190610a6e919061302f565b600061081c7fb19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e83611098565b6001600160a01b03811660009081526002602081905260409091205460ff16818111156112ec576112ec612e71565b1461135f5760405162461bcd60e51b815260206004820152602160248201527f7265766f6b6520677561726469616e2072657175657374206e6f74206578697360448201527f74000000000000000000000000000000000000000000000000000000000000006064820152608401610908565b6001600160a01b03811660009081526002602052604090206001015442116113c95760405162461bcd60e51b815260206004820152601360248201527f74696d652064656c6179206e6f742070617373000000000000000000000000006044820152606401610908565b6110777f55435dd261a4b9b3364963f7738a7a662ad9c84396d64be3365284bb7f0a50418261198e565b600081815260016020526040812061081c906119f3565b6114126117ce565b8281146114615760405162461bcd60e51b815260206004820152601360248201527f77726f6e67206172726179206c656e67746873000000000000000000000000006044820152606401610908565b60005b83811015611508576114f685858381811061148157611481613048565b90506020020160208101906114969190612ce9565b60008585858181106114aa576114aa613048565b90506020028101906114bc919061305e565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061185892505050565b80611500816130c3565b915050611464565b5050505050565b60008281526020819052604090206001015461152a81611962565b610972838361198e565b600454600160601b90046001600160a01b03166001600160a01b0316336001600160a01b0316146115a75760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610908565b6001600160a01b038116600090815260026020819052604082205460ff16908111156115d5576115d5612e71565b036116225760405162461bcd60e51b815260206004820152601160248201527f72657175657374206e6f742065786973740000000000000000000000000000006044820152606401610908565b6001600160a01b0381166000818152600260209081526040808320805460ff19169055518281529192917f1d48b67e05d67e03248ab2d9cec0c742d42363adbc05c97aa861c18fbf10485d910160405180910390a350565b6116826119fd565b61168c8383611a70565b611699604084018461305e565b90506000036116ab576116ab83611aac565b61097281611b5b565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16610a3f576000828152602081815260408083206001600160a01b03851684529091529020805460ff1916600117905561170e3390565b6001600160a01b0316816001600160a01b0316837f2f8788117e7eff1d82e926ec794901d17c78024a50270940304540a733656f0d60405160405180910390a45050565b60006110b0836001600160a01b038416611ba8565b60006001600160e01b031982167f7965db0b00000000000000000000000000000000000000000000000000000000148061081c57507f01ffc9a7000000000000000000000000000000000000000000000000000000006001600160e01b031983161461081c565b3360009081527fd329ff8a035c3ce5df2b0dae604d660c0d8783bf7e64be00c1d10db96c0b87b4602052604090205460ff168061180a57503330145b6118565760405162461bcd60e51b815260206004820152600a60248201527f6f6e6c79206f776e6572000000000000000000000000000000000000000000006044820152606401610908565b565b600080846001600160a01b031684846040516118749190613101565b60006040518083038185875af1925050503d80600081146118b1576040519150601f19603f3d011682016040523d82523d6000602084013e6118b6565b606091505b50915091508161150857805160208201fd5b60008060006118d78585611bf7565b915091506118e481611c65565b509392505050565b6118566117ce565b6004546040516001600160a01b0380841692600160601b900416907f450909c1478d09248269d4ad4fa8cba61ca3f50faed58c7aedefa51c7f62b83a90600090a3600480546001600160a01b03909216600160601b026bffffffffffffffffffffffff909216919091179055565b61094a8133611e51565b61197682826116b4565b60008281526001602052604090206109729082611752565b6119988282611ecf565b60008281526001602052604090206109729082611f4e565b60006110b08383611f63565b600082156119ea57816119d060018561311d565b6119da9190613130565b6119e590600161301c565b6110b0565b50600092915050565b600061081c825490565b600454600160601b90046001600160a01b03166001600160a01b0316336001600160a01b0316146118565760405162461bcd60e51b815260206004820152601b60248201527f77616c6c65743a206e6f742066726f6d20456e747279506f696e7400000000006044820152606401610908565b6000611a7b83611f8d565b9050600081516001811115611a9257611a92612e71565b14611aa257610972818484611fed565b610972818361222e565b600480546020830135916bffffffffffffffffffffffff909116906000611ad283613152565b91906101000a8154816bffffffffffffffffffffffff02191690836bffffffffffffffffffffffff1602179055506bffffffffffffffffffffffff161461094a5760405162461bcd60e51b815260206004820152601560248201527f77616c6c65743a20696e76616c6964206e6f6e636500000000000000000000006044820152606401610908565b801561094a57604051600090339060001990849084818181858888f193505050503d8060008114611508576040519150601f19603f3d011682016040523d82523d6000602084013e611508565b6000818152600183016020526040812054611bef5750815460018181018455600084815260208082209093018490558454848252828601909352604090209190915561081c565b50600061081c565b6000808251604103611c2d5760208301516040840151606085015160001a611c21878285856122ba565b94509450505050611c5e565b8251604003611c565760208301516040840151611c4b8683836123a7565b935093505050611c5e565b506000905060025b9250929050565b6000816004811115611c7957611c79612e71565b03611c815750565b6001816004811115611c9557611c95612e71565b03611ce25760405162461bcd60e51b815260206004820152601860248201527f45434453413a20696e76616c6964207369676e617475726500000000000000006044820152606401610908565b6002816004811115611cf657611cf6612e71565b03611d435760405162461bcd60e51b815260206004820152601f60248201527f45434453413a20696e76616c6964207369676e6174757265206c656e677468006044820152606401610908565b6003816004811115611d5757611d57612e71565b03611dca5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202773272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610908565b6004816004811115611dde57611dde612e71565b0361094a5760405162461bcd60e51b815260206004820152602260248201527f45434453413a20696e76616c6964207369676e6174757265202776272076616c60448201527f75650000000000000000000000000000000000000000000000000000000000006064820152608401610908565b6000828152602081815260408083206001600160a01b038516845290915290205460ff16610a3f57611e8d816001600160a01b031660146123f9565b611e988360206123f9565b604051602001611ea992919061317d565b60408051601f198184030181529082905262461bcd60e51b82526109089160040161322a565b6000828152602081815260408083206001600160a01b038516845290915290205460ff1615610a3f576000828152602081815260408083206001600160a01b0385168085529252808320805460ff1916905551339285917ff6391f5c32d9c69d2a47ea670b442974b53935d1edc7fd64eb21e047a839171b9190a45050565b60006110b0836001600160a01b038416612622565b6000826000018281548110611f7a57611f7a613048565b9060005260206000200154905092915050565b60408051808201909152600081526060602082015261081c611fb361016084018461305e565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061271592505050565b6000611ff7610a43565b116120445760405162461bcd60e51b815260206004820152601c60248201527f57616c6c65743a204e6f20677561726469616e7320616c6c6f776564000000006044820152606401610908565b61204d82612772565b6120995760405162461bcd60e51b815260206004820152601f60248201527f57616c6c65743a20496e76616c696420677561726469616e20616374696f6e006044820152606401610908565b6120a16111e4565b83602001515110156120f55760405162461bcd60e51b815260206004820152601e60248201527f57616c6c65743a20496e73756666696369656e7420677561726469616e7300006044820152606401610908565b600080805b856020015151811015610b9a5760008660200151828151811061211f5761211f613048565b602002602001015190506121928160000151612188876040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b83602001516127dc565b805192506001600160a01b03808516908416116122175760405162461bcd60e51b815260206004820152602160248201527f496e76616c696420677561726469616e20616464726573732070726f7669646560448201527f64000000000000000000000000000000000000000000000000000000000000006064820152608401610908565b829350508080612226906130c3565b9150506120fa565b6000826020015160008151811061224757612247613048565b6020026020010151905061097281600001516122b0846040517f19457468657265756d205369676e6564204d6573736167653a0a3332000000006020820152603c8101829052600090605c01604051602081830303815290604052805190602001209050919050565b8360200151612888565b6000807f7fffffffffffffffffffffffffffffff5d576e7357a4501ddfe92f46681b20a08311156122f1575060009050600361239e565b8460ff16601b1415801561230957508460ff16601c14155b1561231a575060009050600461239e565b6040805160008082526020820180845289905260ff881692820192909252606081018690526080810185905260019060a0016020604051602081039080840390855afa15801561236e573d6000803e3d6000fd5b5050604051601f1901519150506001600160a01b0381166123975760006001925092505061239e565b9150600090505b94509492505050565b6000807f7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff8316816123dd60ff86901c601b61301c565b90506123eb878288856122ba565b935093505050935093915050565b6060600061240883600261323d565b61241390600261301c565b67ffffffffffffffff81111561242b5761242b612d06565b6040519080825280601f01601f191660200182016040528015612455576020820181803683370190505b5090507f30000000000000000000000000000000000000000000000000000000000000008160008151811061248c5761248c613048565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a9053507f7800000000000000000000000000000000000000000000000000000000000000816001815181106124ef576124ef613048565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a905350600061252b84600261323d565b61253690600161301c565b90505b60018111156125d3577f303132333435363738396162636465660000000000000000000000000000000085600f166010811061257757612577613048565b1a60f81b82828151811061258d5761258d613048565b60200101907effffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff1916908160001a90535060049490941c936125cc81613254565b9050612539565b5083156110b05760405162461bcd60e51b815260206004820181905260248201527f537472696e67733a20686578206c656e67746820696e73756666696369656e746044820152606401610908565b6000818152600183016020526040812054801561270b57600061264660018361311d565b855490915060009061265a9060019061311d565b90508181146126bf57600086600001828154811061267a5761267a613048565b906000526020600020015490508087600001848154811061269d5761269d613048565b6000918252602080832090910192909255918252600188019052604090208390555b85548690806126d0576126d061326b565b60019003818190600052602060002001600090559055856001016000868152602001908152602001600020600090556001935050505061081c565b600091505061081c565b604080518082019091526000815260606020820152600080838060200190518101906127419190613281565b91509150604051806040016040528083600181111561276257612762612e71565b8152602001919091529392505050565b6000612781606083018361305e565b905060000361279257506000919050565b61081c6127a2606084018461305e565b8080601f01602080910402602001604051908101604052809392919081815260200183838082843760009201919091525061293492505050565b6127e7838383612971565b6128335760405162461bcd60e51b815260206004820152601960248201527f41434c3a20496e76616c696420677561726469616e20736967000000000000006044820152606401610908565b61283c83610871565b6109725760405162461bcd60e51b815260206004820152601a60248201527f41434c3a205369676e6572206e6f74206120677561726469616e0000000000006044820152606401610908565b612893838383612971565b6128df5760405162461bcd60e51b815260206004820152601660248201527f41434c3a20496e76616c6964206f776e657220736967000000000000000000006044820152606401610908565b6128e883610977565b6109725760405162461bcd60e51b815260206004820152601860248201527f41434c3a205369676e6572206e6f7420616e206f776e657200000000000000006044820152606401610908565b60007f4fb2e45d0000000000000000000000000000000000000000000000000000000061296083612ae1565b6001600160e01b0319161492915050565b60008060006129808585611bf7565b9092509050600081600481111561299957612999612e71565b1480156129b75750856001600160a01b0316826001600160a01b0316145b156129c7576001925050506110b0565b600080876001600160a01b0316631626ba7e60e01b88886040516024016129ef9291906133e1565b60408051601f198184030181529181526020820180517bffffffffffffffffffffffffffffffffffffffffffffffffffffffff166001600160e01b0319909416939093179092529051612a429190613101565b600060405180830381855afa9150503d8060008114612a7d576040519150601f19603f3d011682016040523d82523d6000602084013e612a82565b606091505b5091509150818015612a95575080516020145b8015612ad5575080517f1626ba7e0000000000000000000000000000000000000000000000000000000090612ad3908301602090810190840161302f565b145b98975050505050505050565b6000612af08260006004612af9565b61081c90613402565b606081612b0781601f61301c565b1015612b555760405162461bcd60e51b815260206004820152600e60248201527f736c6963655f6f766572666c6f770000000000000000000000000000000000006044820152606401610908565b612b5f828461301c565b84511015612baf5760405162461bcd60e51b815260206004820152601160248201527f736c6963655f6f75744f66426f756e64730000000000000000000000000000006044820152606401610908565b606082158015612bce5760405191506000825260208201604052612c18565b6040519150601f8416801560200281840101858101878315602002848b0101015b81831015612c07578051835260209283019201612bef565b5050858452601f01601f1916604052505b50949350505050565b600060208284031215612c3357600080fd5b81356001600160e01b0319811681146110b057600080fd5b6001600160a01b038116811461094a57600080fd5b60008060008060608587031215612c7657600080fd5b8435612c8181612c4b565b935060208501359250604085013567ffffffffffffffff80821115612ca557600080fd5b818701915087601f830112612cb957600080fd5b813581811115612cc857600080fd5b886020828501011115612cda57600080fd5b95989497505060200194505050565b600060208284031215612cfb57600080fd5b81356110b081612c4b565b634e487b7160e01b600052604160045260246000fd5b6040805190810167ffffffffffffffff81118282101715612d3f57612d3f612d06565b60405290565b604051601f8201601f1916810167ffffffffffffffff81118282101715612d6e57612d6e612d06565b604052919050565b600067ffffffffffffffff821115612d9057612d90612d06565b50601f01601f191660200190565b60008060408385031215612db157600080fd5b82359150602083013567ffffffffffffffff811115612dcf57600080fd5b8301601f81018513612de057600080fd5b8035612df3612dee82612d76565b612d45565b818152866020838501011115612e0857600080fd5b816020840160208301376000602083830101528093505050509250929050565b600060208284031215612e3a57600080fd5b5035919050565b60008060408385031215612e5457600080fd5b823591506020830135612e6681612c4b565b809150509250929050565b634e487b7160e01b600052602160045260246000fd5b6040810160038410612ea957634e487b7160e01b600052602160045260246000fd5b9281526020015290565b60008060408385031215612ec657600080fd5b8235612ed181612c4b565b946020939093013593505050565b60008060408385031215612ef257600080fd5b50508035926020909101359150565b60008083601f840112612f1357600080fd5b50813567ffffffffffffffff811115612f2b57600080fd5b6020830191508360208260051b8501011115611c5e57600080fd5b60008060008060408587031215612f5c57600080fd5b843567ffffffffffffffff80821115612f7457600080fd5b612f8088838901612f01565b90965094506020870135915080821115612f9957600080fd5b50612fa687828801612f01565b95989497509550505050565b600080600060608486031215612fc757600080fd5b833567ffffffffffffffff811115612fde57600080fd5b84016101808187031215612ff157600080fd5b95602085013595506040909401359392505050565b634e487b7160e01b600052601160045260246000fd5b8082018082111561081c5761081c613006565b60006020828403121561304157600080fd5b5051919050565b634e487b7160e01b600052603260045260246000fd5b60008083357fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffe184360301811261309357600080fd5b83018035915067ffffffffffffffff8211156130ae57600080fd5b602001915036819003821315611c5e57600080fd5b600060001982036130d6576130d6613006565b5060010190565b60005b838110156130f85781810151838201526020016130e0565b50506000910152565b600082516131138184602087016130dd565b9190910192915050565b8181038181111561081c5761081c613006565b60008261314d57634e487b7160e01b600052601260045260246000fd5b500490565b60006bffffffffffffffffffffffff80831681810361317357613173613006565b6001019392505050565b7f416363657373436f6e74726f6c3a206163636f756e74200000000000000000008152600083516131b58160178501602088016130dd565b7f206973206d697373696e6720726f6c652000000000000000000000000000000060179184019182015283516131f28160288401602088016130dd565b01602801949350505050565b600081518084526132168160208601602086016130dd565b601f01601f19169290920160200192915050565b6020815260006110b060208301846131fe565b808202811582820484141761081c5761081c613006565b60008161326357613263613006565b506000190190565b634e487b7160e01b600052603160045260246000fd5b600080604080848603121561329557600080fd5b8351600281106132a457600080fd5b8093505060208085015167ffffffffffffffff808211156132c457600080fd5b818701915087601f8301126132d857600080fd5b8151818111156132ea576132ea612d06565b8060051b6132f9858201612d45565b918252838101850191858101908b84111561331357600080fd5b86860192505b838310156133cf578251858111156133315760008081fd5b8601808d03601f19018913156133475760008081fd5b61334f612d1c565b8882015161335c81612c4b565b8152818a0151878111156133705760008081fd5b8083019250508d603f8301126133865760008081fd5b88820151613396612dee82612d76565b8181528f8c8386010111156133ab5760008081fd5b6133ba828c83018e87016130dd565b828b0152508352509186019190860190613319565b80985050505050505050509250929050565b8281526040602082015260006133fa60408301846131fe565b949350505050565b6000815160208301516001600160e01b0319808216935060048310156134325780818460040360031b1b83161693505b50505091905056fea2646970667358221220a75ac6fb821035228e1b7400355d69341bcda3db406cd2d6fee5ef815032169064736f6c63430008110033b19546dff01e856fb3f010c267a7b1c60363cf8a4664e21cc89c26224620214e';
const contract = {
    ABI,
    bytecode
};
exports.SimpleWalletContract = contract;
//# sourceMappingURL=simpleWallet.js.map