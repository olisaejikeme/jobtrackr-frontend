import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../services/authService";
import Toast from "../components/Toast";

function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const navigate = useNavigate();

    async function handleReset() {
        if (!token) return setToast({ message: "Invalid or missing token", type: "error" });
        if (password !== confirmPassword) return setToast({ message: "Passwords do not match", type: "error" });
        if (password.length < 8) return setToast({ message: "Password must be at least 8 characters", type: "error" });

        try {
            setLoading(true);
            await resetPassword(password, token);
            setToast({ message: "Password reset successful! Redirecting...", type: "success" });
            setTimeout(() => navigate("/login"), 2000);
        } catch (error: any) {
            setToast({ message: "Failed to reset password. Token may be expired.", type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 bg-white lg:bg-[#F8FAFC] dark:bg-slate-950">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-10 shadow-sm">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Set New Password</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Please enter a strong new password for your account.</p>

                    <div className="mb-5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-white"
                        />
                    </div>

                    <div className="mb-5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">Confirm New Password</label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 transition-all font-medium text-slate-700 dark:text-white"
                        />
                    </div>

                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="w-full mt-6 bg-[#0F172A] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60"
                    >
                        {loading ? "Updating..." : "Update Password →"}
                    </button>
                </div>
            </div>

            <div className="hidden lg:flex lg:w-1/2 h-full relative">
                <img src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80" alt="Office" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-900/90 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
                    <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20">
                        <span className="text-4xl">✨</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Almost There!</h2>
                    <p className="text-lg text-slate-400 max-w-sm font-medium">Resetting your password is the last step to getting back on track.</p>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;