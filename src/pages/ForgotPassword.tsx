import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../services/authService";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";

function ForgotPassword() {
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const navigate = useNavigate();

    async function handleRequestReset() {
        if (!email) return setToast({ message: "Please enter your email", type: "error" });

        try {
            setLoading(true);
            await forgotPassword(email);

            setToast({
                message: "If an account exists, a reset link has been sent!",
                type: "success"
            });

            setTimeout(() => navigate("/login"), 3000);
        } catch (error: any) {
            // 1. Try to extract the message from the backend ResponseUtils format
            // 2. Fallback to a generic error message
            let errorMessage = "Something went wrong. Please try again.";

            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.message) {
                // This handles cases where the error might be stringified JSON
                try {
                    const parsed = JSON.parse(error.message);
                    errorMessage = parsed.message || errorMessage;
                } catch {
                    errorMessage = error.message;
                }
            }

            setToast({ message: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 bg-white lg:bg-[#F8FAFC] dark:bg-slate-950">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-10 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Forgot Password?</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Enter your email and we'll send you a link to reset your password.</p>

                    <div className="mb-5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">Email Address</label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-white"
                        />
                    </div>

                    <button
                        onClick={handleRequestReset}
                        disabled={loading}
                        className="w-full mt-6 bg-[#0F172A] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                        {loading ? "Sending..." : "Send Reset Link →"}
                    </button>

                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                        Remembered it?{" "}
                        <span onClick={() => navigate("/login")} className="font-bold text-[#0F172A] dark:text-blue-400 cursor-pointer hover:border-b-2 border-[#0F172A]">Back to Login</span>
                    </p>
                </div>
            </div>

            {/* Same Immersive Right Panel */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Office" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-900/90 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
                    <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20">
                        <span className="text-4xl">🔐</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Secure Your Account</h2>
                    <p className="text-lg text-slate-400 max-w-sm font-medium">Quickly regain access to your job tracking dashboard.</p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;