import { useState } from "react";
import { useTheme } from "../context/ThemeContext";
import { changePassword } from "../services/authService";

function Settings() {
    const { theme, toggleTheme } = useTheme();

    const [name, setName] = useState("Alexander Mitchell");
    const [email, setEmail] = useState("alex.mitchell@design.co");

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    // UI Feedback States
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);

    const handlePasswordUpdate = async () => {
        // Reset message
        setMessage(null);

        // Basic Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setMessage({ text: "All password fields are required.", type: "error" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage({ text: "New passwords do not match.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            await changePassword({ currentPassword, newPassword });

            setMessage({ text: "Password updated successfully!", type: "success" });
            // Clear inputs on success
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setMessage({ text: err.message || "Failed to update password", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="h-full flex flex-col p-8 max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                    Settings
                </h1>
            </div>

            {/* PROFILE (Static for now) */}
            <div className="mb-10">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">PROFILE</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
                    Manage your personal information and public identity.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                FULL NAME
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                EMAIL
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button className="px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all">
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD (UPDATED) */}
            <div className="mb-10">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold tracking-wider">Change Password</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
                    {message && (
                        <div className={`p-3 rounded-lg text-xs font-bold ${message.type === 'success' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'}`}>
                            {message.text}
                        </div>
                    )}

                    <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            CURRENT PASSWORD
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                CONFIRM NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handlePasswordUpdate}
                            disabled={loading}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            {/* PREFERENCES */}
            <div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">PREFERENCES</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
                    Customize your visual workspace and app behavior.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Theme
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Toggle between light and dark modes.
                        </p>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-sm">
                        <button
                            onClick={() => theme === "dark" && toggleTheme()}
                            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${theme === "light"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                }`}
                        >
                            ☀ Light
                        </button>

                        <button
                            onClick={() => theme === "light" && toggleTheme()}
                            className={`px-4 py-1.5 rounded-lg font-medium transition-all ${theme === "dark"
                                ? "bg-slate-700 text-white shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                }`}
                        >
                            🌙 Dark
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;