export interface IModalProps {
    modalId: string;
}

export interface IWalletSettingModal {
    onCancel: () => void;
}

export interface IAccountSettingModal {
    onCancel: () => void;
}

export interface ITokenSelectModal {
    ethOnly: boolean;
    onChange: (val: string) => void;
    onCancel: () => void;
}
