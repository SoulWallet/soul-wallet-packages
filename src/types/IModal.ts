export interface IModalProps {
    modalId: string;
}

export interface IAccountSettingModal {
    onCancel: () => void;
}

export interface ITokenSelectModal {
    ethOnly?: boolean;
    onChange: (val: string) => void;
    onCancel: () => void;
}
