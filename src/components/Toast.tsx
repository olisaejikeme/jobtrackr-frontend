import { useEffect } from "react";

type Props = {
    message: string;
    type?: "success" | "error";
    onClose: () => void;
};

function Toast({ message, type = "success", onClose }: Props) {
    useEffect(() => {
        const timer = setTimeout(onClose, 3000);
        return () => clearTimeout(timer);
    }, []);

    return (
        <div
            className={`fixed top-5 right-5 px-4 py-2 rounded-md text-white shadow-md ${type === "success" ? "bg-green-600" : "bg-red-600"
                }`}
        >
            {message}
        </div>
    );
}

export default Toast;