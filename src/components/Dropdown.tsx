import { useState } from "react";

type Props = {
    onEdit: () => void;
    onDelete: () => void;
};

function Dropdown({ onEdit, onDelete }: Props) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative">
            {/* Trigger */}
            <button
                onClick={() => setOpen(!open)}
                className="text-gray-500 hover:text-black"
            >
                ⋮
            </button>

            {/* Menu */}
            {open && (
                <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-md z-10">
                    <button
                        onClick={() => {
                            onEdit();
                            setOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm hover:bg-gray-100"
                    >
                        Edit
                    </button>

                    <button
                        onClick={() => {
                            onDelete();
                            setOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-gray-100"
                    >
                        Delete
                    </button>
                </div>
            )}
        </div>
    );
}

export default Dropdown;