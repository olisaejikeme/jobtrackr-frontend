import type { ReactNode } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { getUserMe } from "../services/authService";

type Props = { children: ReactNode };

function AppLayout({ children }: Props) {
    const { theme, toggleTheme } = useTheme();
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [user, setUser] = useState({ name: "Loading...", email: "" });
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await getUserMe();
                // Map backend 'first_name' to frontend 'name'
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

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    };

    const handleLogout = () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        navigate("/login");
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            <div className="w-64 bg-[#0F172A] dark:bg-slate-900 text-white px-5 py-6 flex flex-col shrink-0 transition-colors duration-300">
                <h2 className="text-xl font-bold mb-10 tracking-tight px-3">JobTrackr</h2>
                <nav className="space-y-2 text-sm flex-1">
                    <NavLink to="/dashboard" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white shadow-sm" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>Dashboard</NavLink>
                    <NavLink to="/applications" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>Applications</NavLink>
                    <NavLink to="/resumes" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>Resumes</NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `block px-4 py-2.5 rounded-xl transition font-medium ${isActive ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}>Settings</NavLink>
                </nav>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
                <div className="h-16 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 px-8 flex items-center justify-end shrink-0 transition-colors duration-300">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-3 pl-6 border-l border-slate-100 dark:border-slate-800">
                            <div className="text-right">
                                <p className="text-sm font-bold text-slate-900 dark:text-white leading-none">{user.name}</p>
                                <p className="text-[10px] text-blue-500 dark:text-blue-400 font-bold mt-1 uppercase">Free Plan</p>
                            </div>
                            <div className="relative">
                                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)} className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-full border-2 border-white dark:border-slate-600 flex items-center justify-center">
                                    <span className="text-sm font-bold text-slate-600 dark:text-slate-300">{getInitials(user.name)}</span>
                                </button>
                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-800 rounded-xl shadow-xl border border-slate-100 dark:border-slate-700 z-20">
                                        <div className="p-3 border-b border-slate-100 dark:border-slate-700">
                                            <p className="text-sm font-bold text-slate-700 dark:text-white">{user.name}</p>
                                            <p className="text-xs text-slate-500 dark:text-slate-400">{user.email}</p>
                                        </div>
                                        <div className="p-2">
                                            <button onClick={handleLogout} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Logout</button>
                                        </div>
                                    </div>
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