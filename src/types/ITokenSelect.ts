export interface ITokenSelect {
    label: string;
    labelTip?: string;
    ethOnly?: boolean;
    selectedAddress: string;
    onChange: (val: string) => void;
}
