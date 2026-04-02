import { useState } from "react";
import { register } from "../services/authService";
import { useNavigate } from "react-router-dom";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const navigate = useNavigate();

    async function handleRegister() {
        try {
            await register({ name, email, password });

            // After successful register → go to login
            navigate("/login");
        } catch (error) {
            console.error("Registration failed");
        }
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#F1F5F9] px-4">

            {/* CARD */}
            <div className="w-full max-w-md bg-white rounded-2xl p-8 shadow-lg border border-gray-200">

                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    <h1 className="text-lg font-semibold text-[#0F172A]">
                        JobTrackr
                    </h1>
                </div>

                {/* Heading */}
                <h2 className="text-2xl font-bold text-[#0F172A] mb-2 text-center">
                    Create an account
                </h2>
                <p className="text-sm text-gray-500 mb-6 text-center">
                    Start managing your career journey
                </p>

                {/* Name */}
                <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                        FULL NAME
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                        EMAIL ADDRESS
                    </label>
                    <input
                        type="email"
                        placeholder="name@company.com"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                </div>

                {/* Password */}
                <div className="mb-2">
                    <label className="text-xs font-semibold text-gray-600 block mb-1">
                        PASSWORD
                    </label>

                    <input
                        type="password"
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-4 py-3 rounded-lg bg-[#F8FAFC] border border-gray-200 outline-none focus:ring-2 focus:ring-[#0F172A]"
                    />
                </div>

                {/* Button */}
                <button
                    onClick={handleRegister}
                    className="w-full mt-6 bg-[#0F172A] text-white py-3 rounded-xl font-medium hover:opacity-90 transition shadow-sm"
                >
                    Create account →
                </button>

                {/* Divider */}
                <div className="my-6 border-t border-gray-200"></div>

                {/* Footer inside card */}
                <p className="text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <span
                        onClick={() => navigate("/login")}
                        className="font-semibold text-[#0F172A] cursor-pointer hover:underline"
                    >
                        Log in
                    </span>
                </p>
            </div>

            {/* PAGE FOOTER */}
            <div className="mt-8 text-center text-xs text-gray-500 space-y-2">
                <div className="flex justify-center gap-4">
                    <span className="cursor-pointer hover:underline">Privacy Policy</span>
                    <span className="cursor-pointer hover:underline">Terms of Use</span>
                    <span className="cursor-pointer hover:underline">Support</span>
                </div>

                <p>© 2026 JOBTRACKR. — BUILT FOR FOCUS.</p>
            </div>

        </div>
    );
}

export default Register;