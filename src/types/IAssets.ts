export enum EnAlign {
    Left = "left",
    Right = "right",
    Center = "center",
}

export interface ICostItem {
    label?: string;
    value?: string;
    loading?: boolean;
    memo?: string;
    align?: EnAlign;
}
