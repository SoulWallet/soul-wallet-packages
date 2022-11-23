
export const WalletAbi = [
    {
        inputs: [],
        name: "nonce",
        outputs: [
            {
                internalType: "uint256",
                name: "",
                type: "uint256",
            },
        ],
        stateMutability: "view",
        type: "function",
    },
];

export const EntryPointAbi = [{
    inputs: [
        {
            internalType: "address",
            name: "dest",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "value",
            type: "uint256",
        },
        {
            internalType: "bytes",
            name: "func",
            type: "bytes",
        },
    ],
    name: "execFromEntryPoint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
}];