import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    className?: string;
};

function Card({ children, className = "" }: Props) {
    return (
        <div
            className={`bg-white p-6 rounded-2xl border border-gray-200 shadow-sm ${className}`}
        >
            {children}
        </div>
    );
}

export default Card;