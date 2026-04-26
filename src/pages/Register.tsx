import { useState, useEffect } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";

// Simple toggle icons
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

function Register() {
    const { theme, toggleTheme } = useTheme();

    console.log("Current theme:", theme);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
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

    async function handleRegister() {
        if (!name || !email || !password) {
            setToast({ message: "Please fill in all fields", type: "error" });
            return;
        }
        if (password !== confirmPassword) {
            setToast({ message: "Passwords do not match!", type: "error" });
            return;
        }

        try {
            setLoading(true);
            await register({ name, email, password });
            setToast({ message: "Account created! Redirecting to login...", type: "success" });
            setTimeout(() => navigate("/login"), 1500);
        } catch (error: any) {
            const msg = error.response?.data?.message || "Registration failed. Please try again.";
            setToast({ message: msg, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* THEME TOGGLE BUTTON - Responsive positioning */}
            <button
                onClick={toggleTheme}
                className="absolute top-4 right-4 sm:top-6 sm:right-6 lg:right-[52%] z-50 p-2 md:p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* LEFT SIDE (FORM) - Full width on mobile, half on desktop */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-4 sm:px-6 py-6 sm:py-8 bg-white lg:bg-[#F8FAFC] dark:bg-slate-950 overflow-y-auto">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    {isMobile && (
                        <div className="flex flex-col items-center mb-6 sm:mb-8">
                            <div className="w-12 h-12 bg-[#0F172A] dark:bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-3 shadow-lg">
                                J
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight text-center">
                                Create your account
                            </h2>
                        </div>
                    )}

                    {/* Desktop Header - Hidden on mobile */}
                    <div className="hidden sm:block mb-6 md:mb-8 lg:mb-10">
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-[#0F172A] dark:bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold mb-4 md:mb-6 shadow-lg shadow-slate-200 dark:shadow-none">
                            J
                        </div>
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">
                            Create your account
                        </h2>
                        <p className="text-slate-500 dark:text-slate-400 font-medium text-sm sm:text-base">
                            Track applications and optimize your resume today.
                        </p>
                    </div>

                    <div className="space-y-4 sm:space-y-5">
                        {/* Name */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                                Full Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Jane Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                                className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-blue-500/10 focus:border-slate-400 dark:focus:border-blue-500 transition-all font-medium text-sm sm:text-base"
                                autoFocus
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                                Email Address
                            </label>
                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                                className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-blue-500/10 focus:border-slate-400 dark:focus:border-blue-500 transition-all font-medium text-sm sm:text-base"
                            />
                        </div>

                        {/* Password row - Stack on mobile, side by side on tablet+ */}
                        <div className="flex flex-col sm:grid sm:grid-cols-2 gap-3 sm:gap-4">
                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                                    className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-blue-500/10 transition-all font-medium text-sm sm:text-base"
                                />
                            </div>

                            <div>
                                <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                                    Confirm
                                </label>
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    onKeyPress={(e) => e.key === 'Enter' && handleRegister()}
                                    className="w-full px-3 sm:px-4 py-3 md:py-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-slate-100 dark:focus:ring-blue-500/10 transition-all font-medium text-sm sm:text-base"
                                />
                            </div>
                        </div>

                        <button
                            onClick={handleRegister}
                            disabled={loading}
                            className="w-full bg-[#0F172A] dark:bg-blue-600 text-white py-3.5 md:py-4 rounded-xl md:rounded-2xl font-bold hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base"
                        >
                            {loading ? (
                                <span className="flex items-center gap-2">
                                    <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </span>
                            ) : (
                                "Start tracking for free →"
                            )}
                        </button>
                    </div>

                    <p className="text-center text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-6 sm:mt-8 md:mt-10 font-medium">
                        Already have an account?{" "}
                        <span
                            onClick={() => navigate("/login")}
                            className="text-[#0F172A] dark:text-blue-400 font-bold cursor-pointer hover:underline transition-all"
                        >
                            Log in
                        </span>
                    </p>
                </div>
            </div>

            {/* RIGHT SIDE (GRADIENT PANEL) - Hidden on mobile, shown on desktop */}
            <div className="hidden lg:flex w-1/2 h-full relative bg-[#0F172A] dark:bg-slate-900 overflow-hidden">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[120px]" />

                <div className="absolute top-8 left-10 flex items-center gap-2">
                    <span className="font-bold text-white tracking-tight">JobTrackr</span>
                    <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">Beta</span>
                </div>

                <div className="flex flex-col items-center justify-center w-full text-center px-16 relative z-10">
                    <div className="mb-12 p-8 rounded-[32px] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl w-full max-w-sm rotate-2 hover:rotate-0 transition-transform duration-700">
                        <div className="space-y-5 text-left">
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 bg-emerald-400/20 rounded-lg flex items-center justify-center text-emerald-400 text-xs font-bold">✓</div>
                                    <span className="font-bold text-white text-sm">Senior Frontend Dev</span>
                                </div>
                                <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest bg-emerald-400/10 px-2 py-1 rounded-md">Offer</span>
                            </div>
                            <div className="space-y-3">
                                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full w-[85%] bg-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.5)]" />
                                </div>
                                <div className="flex justify-between text-[10px] font-bold text-white/40 uppercase tracking-widest">
                                    <span>Resume Strength</span>
                                    <span className="text-blue-400">85%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-bold text-white mb-4 leading-tight tracking-tight">
                        Organize your job search.<br />
                        <span className="text-blue-400">Land your dream role.</span>
                    </h2>

                    <p className="text-slate-400 dark:text-slate-500 max-w-sm leading-relaxed font-medium">
                        JobTrackr helps you organize, track, and optimize your job search in one place.
                    </p>

                    <div className="flex gap-3 mt-10">
                        <span className="w-8 h-1.5 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.4)]"></span>
                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                        <span className="w-1.5 h-1.5 bg-white/20 rounded-full"></span>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;