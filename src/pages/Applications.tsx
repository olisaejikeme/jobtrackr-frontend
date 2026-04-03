import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import {
    getApplications,
    createApplication,
    deleteApplication,
} from "../services/applicationService";
import { getResumes } from "../services/resumeService";
import type { Resume } from "../services/resumeService";
import Toast from "../components/Toast";
import { useNavigate } from "react-router-dom";

// Asset Imports
import searchIcon from "../assets/icons/search.svg";
import locationIcon from "../assets/icons/location.svg";
import moreIcon from "../assets/icons/more.svg";
import activeIcon from "../assets/icons/active-apps.svg";
import interviewIcon from "../assets/icons/trend.svg";

type Application = {
    id: number;
    company_name: string;
    job_title: string;
    status: string;
    application_date: string;
    location?: string;
    notes?: string;
};

function Applications() {
    const navigate = useNavigate();

    // --- STATE ---
    const [applications, setApplications] = useState<Application[]>([]);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [filter, setFilter] = useState("All");

    // Resume Logic States
    const [resumeMode, setResumeMode] = useState<"select" | "upload">("select");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    const [formData, setFormData] = useState({
        company_name: "",
        job_title: "",
        status: "APPLIED",
        location: "",
        application_date: new Date().toISOString().split('T')[0],
        resume_version: "",
        notes: ""
    });

    const fetchData = async () => {
        try {
            const [appsRes, resumesRes] = await Promise.all([
                getApplications(),
                getResumes()
            ]);

            const appsData = appsRes.data || [];
            const resumesData = resumesRes.data || [];

            setApplications(appsData);
            setResumes(resumesData);

            // Logic: If no resumes exist, force upload mode
            if (resumesData.length === 0) {
                setResumeMode("upload");
            } else if (!formData.resume_version) {
                setFormData(prev => ({ ...prev, resume_version: resumesData[0].file_name }));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            setToast({ message: "Failed to load applications", type: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await createApplication(formData);
            setToast({ message: "Application created successfully!", type: "success" });
            setIsModalOpen(false);
            fetchData();
            resetForm();
        } catch {
            setToast({ message: "Error creating application", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setFormData({
            company_name: "",
            job_title: "",
            status: "APPLIED",
            location: "",
            application_date: new Date().toISOString().split('T')[0],
            resume_version: resumes[0]?.file_name || "",
            notes: ""
        });
        setSelectedFile(null);
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await deleteApplication(id);
            setToast({ message: "Deleted successfully", type: "success" });
            fetchData();
        } catch {
            setToast({ message: "Failed to delete", type: "error" });
        }
    };

    function getStatusBadgeStyle(status: string) {
        switch (status.toLowerCase()) {
            case "interview": return "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900";
            case "offer": return "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900";
            case "rejected": return "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900";
            default: return "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900";
        }
    }

    const interviewCount = applications.filter(a => a.status.toLowerCase() === "interview").length;

    return (
        <div className="h-full flex flex-col p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {/* HEADER AREA */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">My Applications</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Track and manage your ongoing job search.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all flex items-center gap-2"
                    >
                        <span className="text-lg">+</span> New Application
                    </button>

                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-sm">
                            <img src={interviewIcon} className="w-4 h-4 dark:opacity-60" alt="interview" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{interviewCount} Interviews</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-sm">
                            <img src={activeIcon} className="w-4 h-4 dark:opacity-60" alt="active" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{applications.length} Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* FILTER BAR */}
            <div className="flex flex-col lg:flex-row items-center gap-4 mb-8 shrink-0">
                <div className="relative flex-1 w-full">
                    <input
                        placeholder="Search by title or company..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm dark:text-white dark:placeholder:text-slate-500"
                    />
                    <img src={searchIcon} className="absolute left-4 top-3.5 w-4 h-4 opacity-40 dark:opacity-30" alt="search" />
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto">
                    <div className="relative">
                        <select className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-4 pr-10 py-3 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-300 outline-none shadow-sm cursor-pointer appearance-none min-w-[140px]">
                            <option>Newest First</option>
                            <option>Oldest First</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">▼</span>
                    </div>

                    <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl">
                        {["All", "Applied", "Interviewing", "Offer", "Rejected"].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setFilter(tab)}
                                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === tab
                                    ? "bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm"
                                    : "text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            {applications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-8">
                    {applications.map(app => (
                        <div key={app.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900 uppercase text-lg">
                                        {app.company_name.charAt(0)}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight">{app.job_title}</h3>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{app.company_name}</p>
                                    </div>
                                </div>
                                <div className="relative group/menu">
                                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                        <img src={moreIcon} className="w-5 h-5 opacity-40 dark:opacity-30" alt="options" />
                                    </button>
                                    <div className="hidden group-hover/menu:block absolute right-0 top-10 w-32 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-2xl py-2 z-20">
                                        <button onClick={() => handleDelete(app.id)} className="w-full text-left px-4 py-2 text-xs text-red-500 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-950/50">Delete</button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 mb-6">
                                <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getStatusBadgeStyle(app.status)}`}>
                                    {app.status}
                                </span>
                                <span className="text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                    Applied {new Date(app.application_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-5 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-xs font-medium">
                                    <img src={locationIcon} className="w-3.5 h-3.5 opacity-40 dark:opacity-30" alt="loc" />
                                    <span>{app.location || "Remote"}</span>
                                </div>
                                <button onClick={() => navigate(`/applications/${app.id}`)} className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline underline-offset-4">Details</button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-[2.5rem] text-center px-6 mb-8">
                    <div className="w-32 h-32 bg-blue-50/50 dark:bg-blue-950/20 rounded-full flex items-center justify-center mb-8">
                        <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/30 rounded-3xl rotate-12 flex items-center justify-center">
                            <img src={activeIcon} className="w-10 h-10 -rotate-12 opacity-60 dark:opacity-40" alt="empty" />
                        </div>
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-3">No applications tracked yet</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-sm mb-10 leading-relaxed">
                        Your career journey starts here. Add your first job application to begin tracking your progress and insights.
                    </p>
                    <button onClick={() => setIsModalOpen(true)} className="bg-[#2563EB] text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-blue-200 dark:shadow-blue-900/30 hover:bg-blue-700 transition-all transform active:scale-95">
                        + Add Job Application
                    </button>
                </div>
            )}

            {/* MODAL - EXACT SAME AS DASHBOARD */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Application</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Log your latest job application details.</p>
                </div>

                <form onSubmit={handleCreate} className="space-y-5">
                    {/* Company and Job Title */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Company</label>
                            <input
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="e.g. Google"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Job Title</label>
                            <input
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="Software Engineer"
                                value={formData.job_title}
                                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Status and Location */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Status</label>
                            <select
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <option value="APPLIED">Applied</option>
                                <option value="INTERVIEW">Interview</option>
                                <option value="OFFER">Offer</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Location</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="Remote / New York"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                    </div>

                    {/* Resume Section with Toggle */}
                    <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Resume Document</label>
                            <div className="flex p-1 bg-slate-200/50 dark:bg-slate-700 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setResumeMode("select")}
                                    className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${resumeMode === 'select'
                                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    SELECT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResumeMode("upload")}
                                    className={`px-3 py-1 text-[9px] font-bold rounded-md transition-all ${resumeMode === 'upload'
                                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    UPLOAD
                                </button>
                            </div>
                        </div>

                        {resumeMode === "select" && resumes.length > 0 ? (
                            <select
                                className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all dark:text-white"
                                value={formData.resume_version}
                                onChange={(e) => setFormData({ ...formData, resume_version: e.target.value })}
                            >
                                <option value="" disabled>Choose a resume...</option>
                                {resumes.map(r => <option key={r.id} value={r.file_name}>{r.file_name}</option>)}
                            </select>
                        ) : (
                            <input
                                type="file"
                                className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        setSelectedFile(file);
                                        setFormData({ ...formData, resume_version: file.name });
                                    }
                                }}
                            />
                        )}
                    </div>

                    {/* Notes Section */}
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Notes (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[70px] resize-none transition-all dark:text-white dark:placeholder:text-slate-500"
                            placeholder="Referral from John Doe..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    {/* Footer Actions */}
                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-5 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            type="submit"
                            className="px-8 py-2.5 bg-slate-900 dark:bg-blue-600 hover:bg-black dark:hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? "Processing..." : "Track Application"}
                        </button>
                    </div>
                </form>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default Applications;