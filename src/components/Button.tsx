import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClick?: () => void;
    type?: "button" | "submit";
    variant?: "primary" | "secondary";
    disabled?: boolean;
};

function Button({
    children,
    onClick,
    type = "button",
    variant = "primary",
    disabled = false,
}: Props) {
    const base =
        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const styles = {
        primary:
            "bg-black text-white hover:bg-gray-900 focus:ring-black disabled:bg-gray-300",
        secondary:
            "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-300",
    };

    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={`${base} ${styles[variant]} ${disabled ? "cursor-not-allowed" : ""
                }`}
        >
            {children}
        </button>
    );
}

export default Button;