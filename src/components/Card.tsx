import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
};

function Card({ children }: Props) {
    return (
        <div className="bg-white p-4 rounded-lg border">
            {children}
        </div>
    );
}

export default Card;