export interface IInputProps {
    label?: string;
    type?: string;
    memo?: string;
    placeholder?: string;
    verified?: boolean;
    value: string;
    labelColor?: string;
    error: string;
    ExtraButton?: React.ReactNode;
    onEnter?: () => void;
    onChange: (value: string) => void;
}
