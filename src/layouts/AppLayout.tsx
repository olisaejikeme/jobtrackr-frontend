import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTheme } from "../context/ThemeContext";

// Icons for theme toggle
const SunIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M3 12h2.25m.386-6.364l-1.591 1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M18.75 12a6.75 6.75 0 11-13.5 0 6.75 6.75 0 0113.5 0z" />
    </svg>
);

const MoonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
    </svg>
);

type Props = {
    children: ReactNode;
};

function AppLayout({ children }: Props) {
    const { theme, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        // FIX: Match the key used in Login and ProtectedRoute
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        navigate("/login");
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {/* SIDEBAR */}
            <div className="w-64 bg-[#0F172A] dark:bg-slate-900 text-white px-5 py-6 flex flex-col shrink-0 transition-colors duration-300">
                <h2 className="text-xl font-bold mb-10 tracking-tight px-3">JobTrackr</h2>

                <nav className="space-y-2 text-sm flex-1">
                    <NavLink
                        to="/dashboard"
                        className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-xl transition font-medium ${isActive
                                ? "bg-white/10 text-white shadow-sm"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-xl transition font-medium ${isActive
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        Applications
                    </NavLink>

                    <NavLink
                        to="/resumes"
                        className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-xl transition font-medium ${isActive
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        Resumes
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `block px-4 py-2.5 rounded-xl transition font-medium ${isActive
                                ? "bg-white/10 text-white"
                                : "text-slate-400 hover:bg-white/5 hover:text-white"
                            }`
                        }
                    >
                        Settings
                    </NavLink>
                </nav>

                <div className="mt-auto px-4 py-4 border-t border-white/5 text-[10px] text-slate-500 font-bold uppercase tracking-widest">
                    © 2026 JobTrackr
                </div>
            </div>

            {/* MAIN AREA */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* TOPBAR */}
                <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-end shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-6">
                        <button
                            onClick={handleLogout}
                            className="text-xs font-bold text-slate-400 dark:text-slate-500 hover:text-red-500 dark:hover:text-red-400 transition-colors uppercase tracking-wider"
                        >
                            Logout
                        </button>
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 dark:border-slate-800">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">Alex Johnson</p>
                                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold mt-1 uppercase">Free Plan</p>
                            </div>

                            {/* User Avatar Button with Dropdown */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-600 shadow-sm hover:shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {/* Avatar placeholder - you can add an image here later */}
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">AJ</span>
                                </button>

                                {/* Dropdown Menu */}
                                {isUserMenuOpen && (
                                    <>
                                        {/* Backdrop */}
                                        <div
                                            className="fixed inset-0 z-10"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        />

                                        {/* Dropdown */}
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20">
                                            <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                                                <p className="text-sm font-bold text-slate-700 dark:text-white">Alex Johnson</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">alex@jobtrackr.com</p>
                                            </div>

                                            <div className="p-2">
                                                <NavLink
                                                    to="/settings"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <span>⚙️</span>
                                                    Settings
                                                </NavLink>

                                                <button
                                                    onClick={() => {
                                                        toggleTheme();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                                                        <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                                                    </div>
                                                    <span className="text-xs text-slate-400 dark:text-slate-500">
                                                        {theme === "dark" ? "☀️" : "🌙"}
                                                    </span>
                                                </button>

                                                <div className="border-t border-slate-100 dark:border-slate-700 my-1" />

                                                <button
                                                    onClick={() => {
                                                        handleLogout();
                                                        setIsUserMenuOpen(false);
                                                    }}
                                                    className="w-full flex items-center gap-3 px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 rounded-lg transition-colors"
                                                >
                                                    <span>🚪</span>
                                                    Logout
                                                </button>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* CONTENT */}
                <div className="flex-1 overflow-y-auto">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;