import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import { changePassword, getUserMe, updateProfile } from "../services/authService";
import Toast from "../components/Toast";

function Settings() {
    const { theme, toggleTheme } = useTheme();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [profileLoading, setProfileLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Password States
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Fetch user data on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                const response = await getUserMe();
                if (response.status && response.data) {
                    setName(response.data.name);
                    setEmail(response.data.email);
                }
            } catch (error) {
                console.error("Failed to fetch user data:", error);
                setToast({ message: "Failed to load user profile", type: "error" });
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleProfileUpdate = async () => {
        setProfileLoading(true);
        setToast(null);

        try {
            const response = await updateProfile({ name, email });

            if (response.status) {
                setToast({ message: "Profile updated successfully!", type: "success" });
                // Update local state with the response data
                if (response.data) {
                    setName(response.data.name);
                    setEmail(response.data.email);
                }
            } else {
                setToast({ message: response.message || "Failed to update profile", type: "error" });
            }
        } catch (error: any) {
            console.error("Profile update error:", error);
            setToast({ message: error.message || "An error occurred while updating profile", type: "error" });
        } finally {
            setProfileLoading(false);
        }
    };

    const handlePasswordUpdate = async () => {
        // Reset message
        setToast(null);

        // Basic Validation
        if (!currentPassword || !newPassword || !confirmPassword) {
            setToast({ message: "All password fields are required.", type: "error" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setToast({ message: "New passwords do not match.", type: "error" });
            return;
        }

        if (newPassword.length < 8) {
            setToast({ message: "Password must be at least 8 characters long.", type: "error" });
            return;
        }

        try {
            setPasswordLoading(true);
            await changePassword({ currentPassword, newPassword });

            setToast({ message: "Password updated successfully!", type: "success" });
            // Clear inputs on success
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (err: any) {
            setToast({ message: err.message || "Failed to update password", type: "error" });
        } finally {
            setPasswordLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-10 w-10 md:h-12 md:w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300 overflow-y-auto">
            {/* TOAST NOTIFICATION */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* HEADER */}
            <div className="mb-6 md:mb-8">
                <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                    Settings
                </h1>
            </div>

            {/* PROFILE SECTION */}
            <div className="mb-8 md:mb-10">
                <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mb-1 font-bold tracking-wider">PROFILE</p>
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 mb-4 md:mb-6">
                    Manage your personal information and public identity.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl p-5 md:p-6 shadow-sm">
                    {/* Form fields - Stack on mobile, side by side on tablet+ */}
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                FULL NAME
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-2 px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                placeholder="Enter your full name"
                            />
                        </div>

                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                EMAIL
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-5 md:mt-6">
                        <button
                            onClick={handleProfileUpdate}
                            disabled={profileLoading}
                            className="px-4 md:px-5 py-2 md:py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                        >
                            {profileLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD SECTION */}
            <div className="mb-8 md:mb-10">
                <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold tracking-wider">Change Password</p>
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 mb-4 md:mb-6">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl p-5 md:p-6 space-y-5 md:space-y-6 shadow-sm">
                    <div>
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                            CURRENT PASSWORD
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full mt-2 px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                        />
                    </div>

                    {/* Password fields - Stack on mobile, side by side on tablet+ */}
                    <div className="flex flex-col md:grid md:grid-cols-2 gap-5 md:gap-8">
                        <div>
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-2 px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
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
                                className="w-full mt-2 px-3 md:px-4 py-2 md:py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handlePasswordUpdate}
                            disabled={passwordLoading}
                            className="px-5 md:px-6 py-2 md:py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-xs md:text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed w-full md:w-auto"
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
                        </button>
                    </div>
                </div>
            </div>

            {/* PREFERENCES SECTION */}
            <div>
                <p className="text-[11px] md:text-xs text-slate-500 dark:text-slate-400 mb-1 font-bold tracking-wider">PREFERENCES</p>
                <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 mb-4 md:mb-6">
                    Customize your visual workspace and app behavior.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl md:rounded-2xl p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                            Theme
                        </p>
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                            Toggle between light and dark modes.
                        </p>
                    </div>

                    {/* Theme Toggle Buttons - Responsive */}
                    <div className="flex bg-slate-100 dark:bg-slate-800 rounded-xl p-1 text-sm w-full sm:w-auto">
                        <button
                            onClick={() => theme === "dark" && toggleTheme()}
                            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg font-medium transition-all ${theme === "light"
                                ? "bg-white text-slate-900 shadow-sm"
                                : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white"
                                }`}
                        >
                            ☀ Light
                        </button>

                        <button
                            onClick={() => theme === "light" && toggleTheme()}
                            className={`flex-1 sm:flex-none px-3 md:px-4 py-1.5 rounded-lg font-medium transition-all ${theme === "dark"
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