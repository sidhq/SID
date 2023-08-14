export interface ConnectSidButtonProps {
    width?: number;
    height?: number;
    fontScale?: number;
    isConnected?: boolean;
    onDisconnect?: () => void;
    href?: string;
    className?: string;
}

export interface sidSVGProps {
    width: number | undefined;
    height: number | undefined;
    fill: string;
}