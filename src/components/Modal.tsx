import type { ReactNode } from "react";

type Props = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
};

function Modal({ isOpen, onClose, children }: Props) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 dark:bg-black/70 backdrop-blur-sm transition-all duration-300">
            <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-xl animate-fadeIn border border-slate-100 dark:border-slate-800">
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-400 dark:text-slate-500 hover:text-black dark:hover:text-white transition-colors"
                >
                    ✕
                </button>

                {children}
            </div>
        </div>
    );
}

export default Modal;