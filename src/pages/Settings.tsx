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
            setToast({ text: "All password fields are required.", type: "error" });
            return;
        }

        if (newPassword !== confirmPassword) {
            setToast({ text: "New passwords do not match.", type: "error" });
            return;
        }

        if (newPassword.length < 8) {
            setToast({ text: "Password must be at least 8 characters long.", type: "error" });
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
            <div className="h-full flex flex-col p-8 max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
                <div className="flex items-center justify-center h-full">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                        <p className="text-slate-500 dark:text-slate-400">Loading profile...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col p-8 max-w-4xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {/* TOAST NOTIFICATION */}
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* HEADER */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                    Settings
                </h1>
            </div>

            {/* PROFILE */}
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
                                className="w-full mt-2 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                placeholder="Enter your email"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleProfileUpdate}
                            disabled={profileLoading}
                            className="px-5 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {profileLoading ? "Saving..." : "Save Changes"}
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-10">
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-1 uppercase font-bold tracking-wider">Change Password</p>
                <p className="text-sm text-slate-400 dark:text-slate-500 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 space-y-6 shadow-sm">
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
                            disabled={passwordLoading}
                            className="px-6 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {passwordLoading ? "Updating..." : "Update Password"}
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