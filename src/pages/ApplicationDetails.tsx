import { useParams, Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";
import { deleteApplication } from "../services/applicationService";
import type { Application } from "../services/applicationService";
import TrashIcon from "../assets/icons/trash.svg";

interface ApiResponse<T> {
    status: boolean;
    message: string;
    data: T;
}

function ApplicationDetails() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    // 1. STATE MANAGEMENT
    const [app, setApp] = useState<any | null>(null); // Using any to support the joined resume_name
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isUpdating, setIsUpdating] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    // 2. DATA FETCHING
    useEffect(() => {
        const fetchApplication = async () => {
            try {
                setLoading(true);
                const response = await apiRequest<ApiResponse<any>>(`/applications/${id}`);
                if (response.status) {
                    setApp(response.data);
                } else {
                    setError(response.message || "Could not find this application.");
                }
            } catch (err) {
                setError("An error occurred while fetching the application.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchApplication();
    }, [id]);

    // 3. HANDLERS
    const handleStatusChange = async (newStatus: string) => {
        if (!app || isUpdating) return;
        try {
            setIsUpdating(true);
            const formData = new FormData();
            formData.append("status", newStatus);

            const response = await apiRequest<ApiResponse<any>>(
                `/applications/${id}/status`,
                { method: "PATCH", body: formData }
            );

            if (response.status) {
                setApp(response.data);
            }
        } catch (err) {
            console.error("Status update failed", err);
        } finally {
            setIsUpdating(false);
        }
    };

    const confirmDelete = async () => {
        try {
            await deleteApplication(Number(id));
            navigate("/applications");
        } catch (err) {
            alert("Failed to delete application.");
        }
    };

    const formatValue = (value: any) => (value && value !== "" ? value : "N/A");

    // 4. RENDER STATES
    if (loading) return <div className="p-8 text-center dark:text-white font-medium">Loading application...</div>;
    if (error) return <div className="p-8 text-center text-red-500 font-medium">{error}</div>;
    if (!app) return null;

    return (
        <div className="bg-[#F8FAFC] dark:bg-slate-950 min-h-screen transition-colors duration-300 relative">

            {/* CUSTOM DELETE MODAL */}
            {showDeleteModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-slate-200 dark:border-slate-800">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Application?</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
                            This action cannot be undone. All notes and data for this job will be removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold text-sm"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-bold text-sm transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* BREADCRUMB */}
            <div className="px-8 py-4 flex items-center gap-2 text-xs font-medium text-slate-400 dark:text-slate-500">
                <Link to="/applications" className="hover:text-blue-600 dark:hover:text-blue-400">Applications</Link>
                <span>›</span>
                <span className="text-slate-600 dark:text-slate-300">{formatValue(app.job_title)}</span>
            </div>

            <div className="px-8 pb-12 max-w-7xl mx-auto">
                {/* HEADER */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                        {formatValue(app.job_title)}
                    </h1>
                    <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300 font-semibold text-sm">
                            <span className="w-5 h-5 bg-slate-200 dark:bg-slate-800 rounded flex items-center justify-center text-[10px]">🏢</span>
                            {formatValue(app.company_name)}
                        </div>
                        <span className="text-slate-300 dark:text-slate-600">•</span>
                        <div className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400 text-sm font-medium">
                            📍 {formatValue(app.location)}
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* LEFT COLUMN */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0F172A] dark:text-white text-lg">About the Job</h3>
                                {app.job_link && (
                                    <a href={app.job_link} target="_blank" rel="noreferrer" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">
                                        View original post
                                    </a>
                                )}
                            </div>
                            <div className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                <p className="whitespace-pre-wrap">{app.job_description || "No description provided."}</p>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] dark:text-white text-lg mb-6">My Notes</h3>
                            <div className="relative">
                                <textarea
                                    defaultValue={app.notes || ""}
                                    placeholder="Jot down interview questions or reminders..."
                                    className="w-full h-64 p-6 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500/20 text-slate-600 dark:text-slate-300 resize-none"
                                />
                                <div className="absolute bottom-4 right-4 text-[10px] font-bold text-slate-300 dark:text-slate-600 uppercase tracking-widest">Auto-saved</div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                                Status {isUpdating && "..."}
                            </label>

                            <select
                                value={app.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                                disabled={isUpdating}
                                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 dark:text-white outline-none mb-6 cursor-pointer"
                            >
                                <option value="Applied">Applied</option>
                                <option value="Interviewing">Interviewing</option>
                                <option value="Offer Received">Offer Received</option>
                                <option value="Rejected">Rejected</option>
                            </select>

                            <button disabled className="w-full bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600 font-bold py-3.5 rounded-xl text-sm mb-4 cursor-not-allowed">
                                📊 Analyze Resume (Coming Soon)
                            </button>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => navigate(`/applications`, { state: { editApplication: app } })}
                                    className="flex-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold py-3 rounded-xl text-xs transition-colors"
                                >
                                    ✏️ Edit Job
                                </button>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="px-4 border border-red-100 dark:border-red-900 hover:bg-red-50 dark:hover:bg-red-950/40 text-red-500 rounded-xl transition-colors flex items-center justify-center"
                                >
                                    <img src={TrashIcon} alt="Delete" className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <h3 className="font-bold text-[#0F172A] dark:text-white mb-6">Job Details</h3>
                            <div className="space-y-6">
                                {[
                                    { icon: "📅", label: "Date Applied", value: formatValue(app.application_date) },
                                    { icon: "🔗", label: "Job Link", value: app.job_link ? <a href={app.job_link} target="_blank" className="text-blue-500 truncate block max-w-[150px]">Open Link</a> : "N/A" },
                                    { icon: "💼", label: "Location", value: formatValue(app.location) }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center">{item.icon}</div>
                                        <div className="min-w-0 flex-1">
                                            <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{item.label}</p>
                                            <div className="text-sm font-bold text-slate-700 dark:text-white">{item.value}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm">
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="font-bold text-[#0F172A] dark:text-white">Used Resume</h3>
                                <button className="text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline">Change</button>
                            </div>

                            <div className="flex items-center gap-4 p-4 border border-slate-200 dark:border-slate-700 rounded-2xl bg-slate-50 dark:bg-slate-800">
                                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-950/40 flex items-center justify-center rounded-xl text-indigo-600">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs font-bold text-slate-700 dark:text-white truncate">
                                        {/* Using resume_name from the joined response */}
                                        {formatValue(app.resume_name || (app.resume_id ? "Attached Resume" : "No resume"))}
                                    </p>
                                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                                        {app.resume_id ? "Primary Version" : "No file linked"}
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