export type GuardianItem = {
    id: string;
    name: string;
    address: string;
    errorMsg?: string;
    GuardianItem?: boolean;
    noNameInput?: boolean;
};

export enum EnHandleMode {
    Create,
    Recover,
}

