import { useState, useRef, useEffect } from "react";

type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

function Dropdown({ onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="p-1 rounded-md text-gray-500 hover:bg-gray-100"
            >
                ⋮
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded-xl shadow-lg z-10 overflow-hidden">
                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dropdown;