import { useState } from "react";

function Settings() {
    const [name, setName] = useState("Alexander Mitchell");
    const [email, setEmail] = useState("alex.mitchell@design.co");

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="p-6 max-w-4xl">

            {/* HEADER */}
            <h1 className="text-xl font-semibold text-[#0F172A] mb-8">
                Settings
            </h1>

            {/* PROFILE */}
            <div className="mb-10">
                <p className="text-xs text-gray-500 mb-1">PROFILE</p>
                <p className="text-sm text-gray-400 mb-6">
                    Manage your personal information and public identity.
                </p>

                <div className="bg-white border border-gray-200 rounded-xl p-6">
                    <div className="grid grid-cols-2 gap-8">

                        <div>
                            <label className="text-xs text-gray-400">
                                FULL NAME
                            </label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full mt-2 pb-2 border-b border-gray-300 outline-none focus:border-[#0F172A]"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400">
                                EMAIL
                            </label>
                            <input
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full mt-2 pb-2 border-b border-gray-300 outline-none focus:border-[#0F172A]"
                            />
                        </div>

                    </div>

                    <div className="flex justify-end mt-6">
                        <button className="text-xs tracking-wider text-gray-600 hover:text-black">
                            SAVE CHANGES
                        </button>
                    </div>
                </div>
            </div>

            {/* PASSWORD */}
            <div className="mb-10">
                <p className="text-xs text-gray-500 mb-1">CHANGE PASSWORD</p>
                <p className="text-sm text-gray-400 mb-6">
                    Ensure your account is using a long, random password to stay secure.
                </p>

                <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">

                    <div>
                        <label className="text-xs text-gray-400">
                            CURRENT PASSWORD
                        </label>
                        <input
                            type="password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full mt-2 pb-2 border-b border-gray-300 outline-none focus:border-[#0F172A]"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                        <div>
                            <label className="text-xs text-gray-400">
                                NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full mt-2 pb-2 border-b border-gray-300 outline-none focus:border-[#0F172A]"
                            />
                        </div>

                        <div>
                            <label className="text-xs text-gray-400">
                                CONFIRM NEW PASSWORD
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full mt-2 pb-2 border-b border-gray-300 outline-none focus:border-[#0F172A]"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <button className="bg-black text-white px-5 py-2 text-sm rounded-md hover:opacity-90">
                            UPDATE PASSWORD
                        </button>
                    </div>
                </div>
            </div>

            {/* PREFERENCES */}
            <div>
                <p className="text-xs text-gray-500 mb-1">PREFERENCES</p>
                <p className="text-sm text-gray-400 mb-6">
                    Customize your visual workspace and app behavior.
                </p>

                <div className="bg-white border border-gray-200 rounded-xl p-6 flex items-center justify-between">

                    <div>
                        <p className="text-sm font-medium text-[#0F172A]">
                            Theme
                        </p>
                        <p className="text-xs text-gray-400">
                            Toggle between light and dark modes.
                        </p>
                    </div>

                    {/* Toggle */}
                    <div className="flex bg-gray-100 rounded-lg p-1 text-sm">
                        <button className="px-3 py-1 bg-white rounded-md shadow-sm">
                            ☀ Light
                        </button>
                        <button className="px-3 py-1 text-gray-500">
                            🌙 Dark
                        </button>
                    </div>

                </div>
            </div>

        </div>
    );
}

export default Settings;