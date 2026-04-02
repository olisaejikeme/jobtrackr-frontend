import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title?: string;
};

function Table({ children, title }: Props) {
    return (
        <div className="bg-white rounded-lg border p-4">
            {title && (
                <h3 className="text-sm font-semibold mb-4">{title}</h3>
            )}

            <table className="w-full text-sm">{children}</table>
        </div>
    );
}

export default Table;