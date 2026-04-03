import { useState } from "react";
import { login } from "../services/authService";
import { useNavigate } from "react-router-dom";
import Toast from "../components/Toast";
import { useTheme } from "../context/ThemeContext";

// Add the same theme toggle icons
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l-1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M18.75 12a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

function Login() {
    const { theme, toggleTheme } = useTheme();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    const navigate = useNavigate();

    async function handleLogin() {
        try {
            setLoading(true);
            const response = await login({ email, password });

            localStorage.setItem("token", response.data.access_token);
            setToast({ message: "Login successful! Redirecting...", type: "success" });

            setTimeout(() => navigate("/dashboard"), 1200);
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || "Invalid email or password. Please try again.";
            setToast({ message: errorMessage, type: "error" });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="h-screen flex overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {/* Global Toast Notification */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}

            {/* THEME TOGGLE BUTTON */}
            <button
                onClick={toggleTheme}
                className="absolute top-6 right-6 lg:right-[52%] z-50 p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 shadow-sm hover:shadow-md transition-all active:scale-95"
            >
                {theme === "dark" ? <SunIcon /> : <MoonIcon />}
            </button>

            {/* LEFT SIDE */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 bg-white lg:bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
                {/* Logo */}
                <div className="flex items-center gap-2 mb-10">
                    <div className="w-8 h-8 bg-[#0F172A] dark:bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold shadow-lg dark:shadow-none">J</div>
                    <span className="text-xl font-bold text-[#0F172A] dark:text-white tracking-tight">JobTrackr</span>
                </div>

                {/* Card */}
                <div className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] p-10 shadow-sm dark:shadow-none transition-all duration-300">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Welcome back</h2>
                    <p className="text-slate-500 dark:text-slate-400 mb-8 font-medium">Log in to manage your career journey</p>

                    {/* Email */}
                    <div className="mb-5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 block mb-2 uppercase tracking-widest">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="name@company.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-slate-100 dark:focus:ring-blue-500/10 transition-all font-medium text-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Password */}
                    <div className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                Password
                            </label>
                            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 cursor-pointer hover:text-[#0F172A] dark:hover:text-blue-400 transition-colors">
                                Forgot password?
                            </span>
                        </div>
                        <input
                            type="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-slate-400 dark:focus:border-blue-500 focus:ring-4 focus:ring-slate-100 dark:focus:ring-blue-500/10 transition-all font-medium text-slate-700 dark:text-white"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleLogin}
                        disabled={loading}
                        className="w-full mt-6 bg-[#0F172A] dark:bg-blue-600 text-white py-4 rounded-2xl font-bold hover:shadow-xl hover:shadow-slate-200 dark:hover:shadow-blue-900/10 transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2"
                    >
                        {loading ? "Verifying..." : "Log in to your account →"}
                    </button>

                    {/* Footer inside card */}
                    <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-8">
                        Don't have an account?{" "}
                        <span
                            onClick={() => navigate("/register")}
                            className="font-bold text-[#0F172A] dark:text-blue-400 cursor-pointer border-b-2 border-transparent hover:border-[#0F172A] dark:hover:border-blue-400 transition-all"
                        >
                            Join JobTrackr
                        </span>
                    </p>
                </div>

                {/* Bottom links */}
                <div className="mt-8 text-[11px] font-bold text-slate-400 dark:text-slate-500 text-center space-x-6 uppercase tracking-widest">
                    <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Privacy</span>
                    <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Terms</span>
                    <span className="cursor-pointer hover:text-slate-600 dark:hover:text-slate-300 transition-colors">Support</span>
                </div>
            </div>

            {/* RIGHT SIDE (IMMERSIVE PANEL) */}
            <div className="hidden lg:flex lg:w-1/2 h-full relative">
                <img
                    src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80"
                    alt="Modern office space"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-slate-950/80 dark:bg-slate-900/90 backdrop-blur-[2px]" />
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-12">
                    <div className="w-20 h-20 bg-white/10 dark:bg-white/5 rounded-[32px] flex items-center justify-center mb-8 backdrop-blur-xl border border-white/20 shadow-2xl">
                        <span className="text-4xl animate-pulse">🚀</span>
                    </div>
                    <h2 className="text-4xl font-bold mb-4 tracking-tight">Accelerate Your Career</h2>
                    <p className="text-lg text-slate-400 dark:text-slate-500 max-w-sm font-medium leading-relaxed">
                        The smartest way to track, manage, and optimize your job applications.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;