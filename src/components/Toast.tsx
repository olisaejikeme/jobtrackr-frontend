import { useEffect } from "react";

type Props = {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
};

function Toast({ message, type = "success", onClose }: Props) {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const styles = {
        success: "bg-emerald-600 shadow-emerald-200/50",
        error: "bg-rose-600 shadow-rose-200/50",
    };

    return (
        <div className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
            <div className={`flex items-center gap-3 px-5 py-3 rounded-2xl text-white shadow-2xl ${styles[type]}`}>
                {type === "success" ? (
                    <span className="text-lg">✓</span>
                ) : (
                    <span className="text-lg">✕</span>
                )}
                <p className="text-sm font-bold tracking-tight whitespace-nowrap">
                    {message}
                </p>
            </div>
        </div>
    );
}

export default Toast;