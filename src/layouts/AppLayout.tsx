import type { ReactNode } from "react";
import { NavLink } from "react-router-dom";

type Props = {
    children: ReactNode;
};

function AppLayout({ children }: Props) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="w-64 bg-gray-900 text-white p-4">
                <h2 className="text-lg font-bold mb-6">JobTrackr</h2>

                <nav className="space-y-2">
                    <NavLink
                        to="/"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
                            }`
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/applications"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
                            }`
                        }
                    >
                        Applications
                    </NavLink>

                    <NavLink
                        to="/resumes"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
                            }`
                        }
                    >
                        Resumes
                    </NavLink>

                    <NavLink
                        to="/settings"
                        className={({ isActive }) =>
                            `block px-3 py-2 rounded ${isActive ? "bg-gray-700" : "hover:bg-gray-800"
                            }`
                        }
                    >
                        Settings
                    </NavLink>
                </nav>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col">
                {/* Topbar */}
                <div className="h-16 bg-white border-b px-6 flex items-center justify-between">

                    {/* LEFT: Search */}
                    <input
                        type="text"
                        placeholder="Search applications..."
                        className="w-80 px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
                    />

                    {/* RIGHT: Actions */}
                    <div className="flex items-center gap-4">

                        {/* Theme toggle (placeholder) */}
                        <button className="text-gray-600 hover:text-black">
                            🌙
                        </button>

                        {/* Notification (placeholder) */}
                        <button className="text-gray-600 hover:text-black">
                            🔔
                        </button>

                        {/* Profile */}
                        <div className="flex items-center gap-2 cursor-pointer">
                            <div className="w-8 h-8 bg-gray-300 rounded-full" />
                            <span className="text-sm font-medium">Profile</span>
                        </div>

                    </div>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-6 bg-gray-50">
                    {children}
                </div>
            </div>
        </div>
    );
}

export default AppLayout;