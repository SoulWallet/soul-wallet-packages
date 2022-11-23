export declare class Guard {
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
    static positiveInteger(value: number): void;
}
