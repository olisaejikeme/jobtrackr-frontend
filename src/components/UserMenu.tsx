import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

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

export default function UserMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold flex items-center justify-center shadow-md hover:shadow-lg transition-all"
            >
                JD
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 overflow-hidden z-20">
                        <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                            <p className="text-sm font-bold text-slate-700 dark:text-white">John Doe</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">john@example.com</p>
                        </div>

                        <div className="p-2">
                            <button
                                onClick={() => {
                                    navigate("/settings");
                                    setIsOpen(false);
                                }}
                                className="w-full flex items-center gap-3 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg transition-colors"
                            >
                                <span>⚙️</span>
                                Settings
                            </button>

                            <button
                                onClick={() => {
                                    toggleTheme();
                                    setIsOpen(false);
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
                                onClick={handleLogout}
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
    );
}