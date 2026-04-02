import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    onClick?: () => void;
};

function Button({ children, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="bg-black text-white px-4 py-2 rounded-md text-sm"
        >
            {children}
        </button>
    );
}

export default Button;