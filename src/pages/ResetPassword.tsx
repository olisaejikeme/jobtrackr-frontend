import { useState, useEffect } from "react";
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
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();

    // Check mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 1024);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

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

            {/* Form Section - Full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 bg-white lg:bg-[#F8FAFC] dark:bg-slate-950 overflow-y-auto">
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm mx-auto">
                    {/* Mobile Logo */}
                    {isMobile && (
                        <div className="flex justify-center mb-6">
                            <div className="w-12 h-12 bg-[#0F172A] dark:bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                                <span className="text-2xl">✨</span>
                            </div>
                        </div>
                    )}

                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight text-center sm:text-left">
                        Set New Password
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 font-medium text-sm sm:text-base text-center sm:text-left">
                        Please enter a strong new password for your account.
                    </p>

                    {/* New Password Input */}
                    <div className="mb-4 sm:mb-5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                            New Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleReset()}
                            className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 dark:text-white text-sm sm:text-base"
                            autoFocus
                        />
                    </div>

                    {/* Confirm Password Input */}
                    <div className="mb-5 sm:mb-6">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                            Confirm New Password
                        </label>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleReset()}
                            className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 dark:text-white text-sm sm:text-base"
                        />
                    </div>

                    {/* Update Button */}
                    <button
                        onClick={handleReset}
                        disabled={loading}
                        className="w-full mt-4 sm:mt-6 bg-[#0F172A] dark:bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Updating...
                            </span>
                        ) : (
                            "Update Password →"
                        )}
                    </button>

                    {/* Back to Login Link */}
                    <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-6 sm:mt-8">
                        Remember your password?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="font-bold text-[#0F172A] dark:text-blue-400 cursor-pointer hover:underline transition-all"
                        >
                            Back to Login
                        </span>
                    </p>
                </div>
            </div>

            {/* Right Panel - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                    alt="Office"
                    className="w-full h-full object-cover"
                />
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