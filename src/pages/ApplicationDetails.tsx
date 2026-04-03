import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";

function ApplicationDetails() {
    const { id } = useParams();

    // 1. STATE MANAGEMENT
    const [app, setApp] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 2. DATA FETCHING LOGIC
    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                // Replace this with your actual API call:
                // const response = await fetch(`/api/applications/${id}`);
                // const data = await response.json();

                // MOCK DELAY & DATA
                await new Promise(resolve => setTimeout(resolve, 500));

                const mockData = {
                    title: "Senior Product Designer",
                    company: "TechFlow Inc.",
                    location: "San Francisco, CA (Hybrid)",
                    salary: "$120k - $150k / yr",
                    dateApplied: "Oct 12, 2023",
                    workType: "Hybrid",
                    status: "Interviewing",
                    description: "TechFlow is seeking a Senior Product Designer to lead design initiatives for our core platform.",
                    responsibilities: [
                        "Lead end-to-end design projects from concept to shipping.",
                        "Create wireframes, prototypes, and high-fidelity mockups.",
                        "Conduct user research and usability testing.",
                        "Collaborate with cross-functional teams to define product strategy."
                    ],
                    resumeName: "Resume_Senior_Product_v3.pdf",
                    resumeDate: "Added 2 days ago"
                };

                setApp(mockData);
            } catch (err) {
                setError("Could not find this application.");
            } finally {
                setLoading(false);
            }
        };

        fetchApplication();
    }, [id]);

    // 3. RENDER LOADING/ERROR STATES
    if (loading) return <div className="p-8 text-center dark:text-white">Loading application...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!app) return null;

    return (
        <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors duration-300">

            {/* BREADCRUMB */}
            <div className="px-8 py-4 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Link to="/applications" className="hover:text-blue-600 dark:hover:text-blue-400">
                    Applications
                </Link>
                <span>›</span>
                <span className="text-slate-600 dark:text-slate-300">{app.title}</span>
            </div>

            <div className="px-8 pb-12 max-w-7xl mx-auto">

                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                        {app.title}
                    </h1>

                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                            <span className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px]">🏢</span>
                            {app.company}
                        </div>

                        <span className="text-slate-300 dark:text-slate-600">•</span>

                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                            📍 {app.location}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">
                                    About the Job
                                </h3>
                                <button className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    View original post
                                </button>
                            </div>

                            <div className="text-slate-600 dark:text-slate-400 leading-relaxed space-y-6">
                                <p>{app.description}</p>

                                <div>
                                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">
                                        Responsibilities:
                                    </h4>

                                    <ul className="space-y-3">
                                        {app.responsibilities?.map((item, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <span className="text-blue-500 mt-1.5 text-[8px]">●</span>
                                                {item}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* NOTES */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] dark:text-white text-lg mb-6">
                                My Notes
                            </h3>
                            <div className="relative">
                                <textarea
                                    placeholder="Jot down interview questions, key contacts, or reminders here..."
                                    className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-slate-600 dark:text-slate-300 resize-none"
                                />
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">
                                    Markdown Supported
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">

                        {/* STATUS SELECT */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                Status
                            </label>

                            <select
                                defaultValue={app.status}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 mb-6"
                            >
                                <option value="Interviewing">Interviewing</option>
                                <option value="Applied">Applied</option>
                                <option value="Offer Received">Offer Received</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                            <button className="w-full bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all mb-4">
                                📊 Analyze Resume
                            </button>

                            <div className="flex gap-3">
                                <button className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors">
                                    ✏️ Edit Job
                                </button>
                                <button className="px-4 border border-red-100 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 rounded-xl transition-colors">
                                    🗑️
                                </button>
                            </div>
                        </div>

                        {/* DYNAMIC DETAILS */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] dark:text-white mb-6">
                                Job Details
                            </h3>

                            <div className="space-y-6">
                                {[
                                    { icon: "💰", label: "Salary Range", value: app.salary },
                                    { icon: "📅", label: "Date Applied", value: app.dateApplied },
                                    { icon: "💼", label: "Work Type", value: app.workType }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">
                                            {item.icon}
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                                                {item.label}
                                            </p>
                                            <p className="text-sm font-bold text-slate-700 dark:text-white">
                                                {item.value}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* RESUME SECTION */}
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0F172A] dark:text-white">
                                    Used Resume
                                </h3>
                                <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                    Change
                                </button>
                            </div>

                            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                <div className="w-10 h-10 bg-red-50 dark:bg-red-950/40 flex items-center justify-center rounded-xl">
                                    📄
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-700 dark:text-white truncate">
                                        {app.resumeName}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                        {app.resumeDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ApplicationDetails;