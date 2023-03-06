export interface ITokenSelect {
    label: string;
    labelTip?: string;
    selectedAddress: string;
    onChange: (val: string) => void;
}
