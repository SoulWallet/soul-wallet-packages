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