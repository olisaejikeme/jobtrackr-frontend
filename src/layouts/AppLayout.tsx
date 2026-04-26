import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getUserMe } from "../services/authService";
import { useTheme } from "../context/ThemeContext";

type Props = { children: ReactNode };

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

function AppLayout({ children }: Props) {
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
    const [user, setUser] = useState({ name: "Loading...", email: "" });
    const [isMobile, setIsMobile] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserMe();
                setUser({
                    name: response.data.name || "User",
                    email: response.data.email
                });
            } catch (err) {
                console.error("Auth error:", err);
                navigate("/login");
            }
        };
        fetchUser();
    }, [navigate]);

    // Close sidebar on route change on mobile
    useEffect(() => {
        if (isMobile) {
            setIsMobileSidebarOpen(false);
        }
    }, [location.pathname, isMobile]);

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    const sidebarContent = (
        <aside className={`w-64 bg-[#0F172A] dark:bg-slate-900 text-white px-5 py-6 flex flex-col shrink-0 transition-transform duration-300 ${isMobile ? (isMobileSidebarOpen ? 'fixed left-0 top-0 z-50 h-full' : 'fixed left-0 top-0 -translate-x-full h-full') : 'relative'
            }`}>
            <div className="flex justify-between items-center mb-10 px-3">
                <h2 className="text-xl font-bold tracking-tight">JobTrackr</h2>
                {isMobile && (
                    <button
                        onClick={() => setIsMobileSidebarOpen(false)}
                        className="text-slate-400 hover:text-white"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>

            <nav className="space-y-2 text-sm flex-1">
                <NavLink to="/dashboard" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                    Dashboard
                </NavLink>
                <NavLink to="/applications" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                    Applications
                </NavLink>
                <NavLink to="/resumes" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                    Resumes
                </NavLink>
                <NavLink to="/settings" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>
                    Settings
                </NavLink>
            </nav>

            {/* Theme toggle in sidebar for mobile */}
            {isMobile && (
                <div className="mt-4 px-3 pt-4 border-t border-slate-800">
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-between px-3 py-2 text-sm text-slate-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
                            <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
                        </div>
                        <span className="text-xs">{theme === "dark" ? "☀️" : "🌙"}</span>
                    </button>
                </div>
            )}
        </aside>
    );

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {/* Mobile Sidebar Overlay */}
            {isMobile && isMobileSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40"
                    onClick={() => setIsMobileSidebarOpen(false)}
                />
            )}

            {sidebarContent}

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-4 md:px-8 flex items-center justify-between shrink-0 transition-colors duration-300">
                    {/* Mobile hamburger button */}
                    {isMobile && (
                        <button
                            onClick={() => setIsMobileSidebarOpen(true)}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                        >
                            <svg className="w-5 h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    )}

                    <div className={`flex items-center gap-6 ${isMobile ? 'ml-auto' : 'ml-auto'}`}>
                        <div className="flex items-center gap-3 pl-0 md:pl-6 border-l-0 md:border-l border-slate-100 dark:border-slate-800">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
                                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold mt-1 uppercase">Free Plan</p>
                            </div>

                            {/* Desktop theme toggle */}
                            {!isMobile && (
                                <button
                                    onClick={toggleTheme}
                                    className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                                    aria-label="Toggle theme"
                                >
                                    {theme === "dark" ? (
                                        <SunIcon />
                                    ) : (
                                        <MoonIcon />
                                    )}
                                </button>
                            )}

                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-600 flex items-center justify-center"
                                >
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{getInitials(user.name)}</span>
                                </button>
                                {isUserMenuOpen && (
                                    <>
                                        <div className="fixed inset-0 z-10" onClick={() => setIsUserMenuOpen(false)} />
                                        <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20">
                                            <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                                                <p className="text-sm font-bold text-slate-700 dark:text-white">{user.name}</p>
                                                <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                            </div>
                                            <div className="p-2">
                                                <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
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
                <div className="flex-1 overflow-y-auto">{children}</div>
            </div>
        </div>
    );
}

export default AppLayout;