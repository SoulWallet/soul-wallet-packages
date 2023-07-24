export type GuardianItem = {
    id: string;
    name: string;
    address: string;
    errorMsg?: string;
};

export enum EnHandleMode {
    Create,
    Recover,
}

export interface ITokenItem {
    icon: any;
    name: string;
    symbol: string;
    address: string;
    decimals: number;
    payable: boolean;
}
