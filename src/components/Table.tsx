import type { ReactNode } from "react";

type Props = {
    children: ReactNode;
    title?: string;
};

function Table({ children, title }: Props) {
    return (
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm">
            {title && (
                <div className="px-6 py-4 border-b border-gray-100">
                    <h3 className="text-sm font-semibold text-gray-700">
                        {title}
                    </h3>
                </div>
            )}

            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    {children}
                </table>
            </div>
        </div>
    );
}

export default Table;