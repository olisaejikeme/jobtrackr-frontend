import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";

// Icons
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l-1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M18.75 12a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

function Login() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Auto-redirect if already logged in
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (token) {
            navigate("/dashboard", { replace: true });
        }
    }, [navigate]);

    async function handleLogin() {
        if (!email || !password) {
            return setToast({ message: "Please fill in all fields", type: "error" });
        }

        try {
            setLoading(true);
            await login({ email, password });

            setToast({ message: "Login successful! Redirecting...", type: "success" });

            // Using a short delay to allow the toast to be seen
            setTimeout(() => {
                navigate("/dashboard", { replace: true });
            }, 1000);
        } catch (error: any) {
            let errorMessage = "Invalid email or password. Please try again.";

            // Try to extract backend error message
            try {
                const parsedError = typeof error.message === 'string' ? JSON.parse(error.message) : error;
                errorMessage = parsedError.detail || parsedError.message || errorMessage;
            } catch {
                errorMessage = error.message || errorMessage;
            }

            setToast({ message: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* Theme Toggle - Responsive positioning */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:right-[52%] z-50 p-2 md:p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* Left Panel: Form - Full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-4 sm:px-6 py-6 sm:py-8 bg-white lg:bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 overflow-y-auto">
                {/* Logo - Responsive sizing and positioning */}
                <div className="flex items-center gap-2 mb-6 sm:mb-8 lg:mb-10">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-[#0F172A] dark:bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg">
                        J
                    </div>
                    <span className="text-lg sm:text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                        JobTrackr
                    </span>
                </div>

                {/* Login Card - Responsive padding and width */}
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl sm:rounded-3xl md:rounded-[32px] p-6 sm:p-8 md:p-10 shadow-sm transition-all duration-300 mx-auto">
                    <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight text-center sm:text-left">
                        Welcome back
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-6 sm:mb-8 font-medium text-sm sm:text-base text-center sm:text-left">
                        Log in to manage your career journey
                    </p>

                    {/* Email Input */}
                    <div className="mb-4 sm:mb-5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 dark:text-white text-sm sm:text-base"
                            autoFocus
                        />
                    </div>

                    {/* Password Input */}
                    <div className="mb-5 sm:mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Password
                            </label>
                            <span
                                onClick={() => navigate("/forgot-password")}
                                className="text-[10px] sm:text-[11px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-[#0F172A] dark:hover:text-blue-400 transition-colors"
                            >
                                Forgot password?
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                            className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all font-medium text-slate-700 dark:text-white text-sm sm:text-base"
                        />
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full bg-[#0F172A] dark:bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:shadow-xl transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                    >
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Verifying...
                            </span>
                        ) : (
                            "Log in to your account →"
                        )}
                    </button>

                    {/* Register Link */}
                    <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-6 sm:mt-8">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="font-bold text-[#0F172A] dark:text-blue-400 cursor-pointer hover:underline transition-all"
                        >
                            Join JobTrackr
                        </span>
                    </p>
                </div>

                {/* Footer Links - Hidden on mobile, shown on tablet+ */}
                <div className="hidden sm:flex mt-6 sm:mt-8 text-[10px] sm:text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center gap-4 sm:gap-6 uppercase tracking-widest">
                    <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy</span>
                    <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms</span>
                    <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Support</span>
                </div>
            </div>

            {/* Right Panel: Image - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                    alt="Office"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-900/90 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
                    <div className="w-20 h-20 bg-white/10 rounded-[32px] flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20">
                        <span className="text-4xl">🚀</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Accelerate Your Career</h2>
                    <p className="text-lg text-slate-400 max-w-sm font-medium leading-relaxed">The smartest way to track, manage, and optimize your job applications.</p>
                </div>
            </div>
        </div>
    );
}

export default Login;