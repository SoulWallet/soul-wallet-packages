export declare class Guard {
    private static _web3;
    private static get web3();
    /**
     * check if the address is valid
     */
    static address(address: string): void;
    /**
     * check if the value is Uint
     */
    static uint(value: string | number): void;
    /**
     * check if the value is 0x....
     */
    static hex(value: string): void;
    /**
     * check if the value is keccak256 hash
     */
    static keccak256(value: string): void;
}
