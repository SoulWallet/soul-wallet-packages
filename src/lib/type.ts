export type GuardianItem = {
    id: string;
    name: string;
    address: string;
    errorMsg?: string;
    inputClassName?: string;
    GuardianItem?: boolean;
    noNameInput?: boolean;
};

export enum EnHandleMode {
    Create,
    Recover,
}

