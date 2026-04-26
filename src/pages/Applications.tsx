import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Modal from "../components/Modal";
import Toast from "../components/Toast";
import {
    getApplications,
    deleteApplication,
} from "../services/applicationService";
import { getResumes } from "../services/resumeService";
import type { Resume } from "../services/resumeService";
import type { Application as ServiceApplication } from "../services/applicationService";

// Asset Imports
import searchIcon from "../assets/icons/search.svg";
import locationIcon from "../assets/icons/location.svg";
import moreIcon from "../assets/icons/more.svg";
import activeIcon from "../assets/icons/active-apps.svg";
import interviewIcon from "../assets/icons/trend.svg";

function Applications() {
    const navigate = useNavigate();

    // --- STATE ---
    const [applications, setApplications] = useState<ServiceApplication[]>([]);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
    const [filter, setFilter] = useState("All");
    const [searchTerm, setSearchTerm] = useState("");
    const [sortOrder, setSortOrder] = useState("Newest First");

    // Resume Logic States
    const [resumeMode, setResumeMode] = useState<"select" | "upload">("select");
    const [_selectedFile, setSelectedFile] = useState<File | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        company_name: "",
        job_title: "",
        status: "APPLIED",
        location: "",
        application_date: new Date().toISOString().split('T')[0],
        job_link: "",
        job_description: "",
        resume_id: null as number | null,
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

            if (resumesData.length === 0) {
                setResumeMode("upload");
            }
        } catch (error) {
            setToast({ message: "Failed to load applications", type: "error" });
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const resetForm = () => {
        setFormData({
            company_name: "",
            job_title: "",
            status: "APPLIED",
            location: "",
            application_date: new Date().toISOString().split('T')[0],
            job_link: "",
            job_description: "",
            resume_id: resumes[0]?.id || null,
            notes: ""
        });
        setSelectedFile(null);
        setEditingId(null);
    };

    const handleOpenAddModal = () => {
        resetForm();
        setIsModalOpen(true);
    };

    const handleEditClick = (app: ServiceApplication) => {
        setFormData({
            company_name: app.company_name,
            job_title: app.job_title,
            status: app.status.toUpperCase(),
            location: app.location || "",
            application_date: app.application_date ? app.application_date.split('T')[0] : "",
            job_link: app.job_link || "",
            job_description: app.job_description || "",
            resume_id: app.resume_id || null,
            notes: app.notes || ""
        });
        setEditingId(app.id);
        setResumeMode("select");
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append("company_name", formData.company_name);
            formDataToSend.append("job_title", formData.job_title);
            formDataToSend.append("status", formData.status);
            if (formData.location) formDataToSend.append("location", formData.location);
            if (formData.application_date) formDataToSend.append("application_date", formData.application_date);
            if (formData.job_link) formDataToSend.append("job_link", formData.job_link);
            if (formData.job_description) formDataToSend.append("job_description", formData.job_description);
            if (formData.resume_id) formDataToSend.append("resume_id", String(formData.resume_id));
            if (formData.notes) formDataToSend.append("notes", formData.notes);
            if (_selectedFile) formDataToSend.append("file", _selectedFile);

            const token = localStorage.getItem("access_token");
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const url = editingId ? `${BASE_URL}/applications/${editingId}` : `${BASE_URL}/applications`;
            const method = editingId ? "PUT" : "POST";

            const response = await fetch(url, {
                method: method,
                headers: { Authorization: token ? `Bearer ${token}` : "" },
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Submission failed");

            setToast({ message: editingId ? "Application updated!" : "Application tracked!", type: "success" });
            setIsModalOpen(false);
            await fetchData();
            resetForm();
        } catch (error) {
            setToast({ message: "Check required fields and try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // --- DELETE LOGIC ---
    const handleDeleteClick = (id: number) => {
        setIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleExecuteDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteApplication(idToDelete);
            setToast({ message: "Deleted successfully", type: "success" });
            fetchData();
        } catch {
            setToast({ message: "Failed to delete", type: "error" });
        } finally {
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
        }
    };

    function getStatusBadgeStyle(status: string) {
        switch (status.toUpperCase()) {
            case "INTERVIEW": return "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900";
            case "OFFER": return "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900";
            case "REJECTED": return "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900";
            default: return "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900";
        }
    }

    const filteredApplications = applications
        .filter(app => {
            const matchesSearch = app.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                app.job_title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesTab = filter === "All" || app.status.toUpperCase() === filter.toUpperCase();
            return matchesSearch && matchesTab;
        })
        .sort((a, b) => {
            const dateA = new Date(a.application_date || 0).getTime();
            const dateB = new Date(b.application_date || 0).getTime();
            return sortOrder === "Newest First" ? dateB - dateA : dateA - dateB;
        });

    const interviewCount = applications.filter(a => a.status.toUpperCase() === "INTERVIEW").length;

    return (
        <div className="h-full flex flex-col p-4 md:p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {/* Header Section - Responsive */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 md:mb-8 gap-4 shrink-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">My Applications</h1>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm mt-1">Track and manage your ongoing job search.</p>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-4 md:px-5 py-2.5 rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all flex items-center justify-center gap-2"
                    >
                        <span className="text-lg">+</span> New Application
                    </button>

                    <div className="flex items-center gap-2 justify-between sm:justify-start">
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-sm flex-1 sm:flex-none">
                            <img src={interviewIcon} className="w-4 h-4 dark:opacity-60" alt="interview" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{interviewCount} Interviews</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-3 py-2 rounded-xl shadow-sm flex-1 sm:flex-none">
                            <img src={activeIcon} className="w-4 h-4 dark:opacity-60" alt="active" />
                            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{applications.length} Active</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Search and Filters - Responsive */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6 md:mb-8 shrink-0">
                <div className="relative flex-1 w-full">
                    <input
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by title or company..."
                        className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl text-sm outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 dark:focus:border-blue-500 transition-all shadow-sm dark:text-white dark:placeholder:text-slate-500"
                    />
                    <img src={searchIcon} className="absolute left-4 top-3.5 w-4 h-4 opacity-40 dark:opacity-30" alt="search" />
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                    <div className="relative w-full sm:w-auto">
                        <select
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 pl-4 pr-10 py-3 rounded-2xl text-sm font-medium text-slate-600 dark:text-slate-300 outline-none shadow-sm cursor-pointer appearance-none w-full"
                        >
                            <option>Newest First</option>
                            <option>Oldest First</option>
                        </select>
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 dark:text-slate-500 text-xs">▼</span>
                    </div>

                    {/* Filter Tabs - Horizontal scroll on mobile */}
                    <div className="overflow-x-auto pb-2 lg:pb-0">
                        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl min-w-max">
                            {["All", "Applied", "Interview", "Offer", "Rejected"].map((tab) => (
                                <button
                                    key={tab}
                                    onClick={() => setFilter(tab)}
                                    className={`px-3 md:px-4 py-2 rounded-xl text-[10px] md:text-xs font-bold transition-all whitespace-nowrap ${filter === tab
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
            </div>

            {/* Applications Grid - Responsive */}
            {filteredApplications.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pb-8 overflow-y-auto">
                    {filteredApplications.map(app => (
                        <div key={app.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-5 md:p-6 shadow-sm hover:shadow-md transition-all relative">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3 md:gap-4 flex-1 min-w-0">
                                    <div className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-xl md:rounded-2xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 font-bold border border-blue-100 dark:border-blue-900 uppercase text-base md:text-lg flex-shrink-0">
                                        {app.company_name.charAt(0)}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <h3 className="font-bold text-slate-900 dark:text-white leading-tight text-sm md:text-base truncate">
                                            {app.job_title}
                                        </h3>
                                        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 font-medium truncate">
                                            {app.company_name}
                                        </p>
                                    </div>
                                </div>

                                <div className="relative group/menu flex-shrink-0">
                                    <button className="p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                        <img src={moreIcon} className="w-4 h-4 md:w-5 md:h-5 opacity-40 dark:opacity-30" alt="options" />
                                    </button>
                                    <div className="invisible group-hover/menu:visible absolute right-0 top-10 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl py-2 z-20">
                                        <button
                                            onClick={() => handleEditClick(app)}
                                            className="w-full text-left px-4 py-2 text-[11px] text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700"
                                        >
                                            Edit Details
                                        </button>
                                        <div className="h-px bg-slate-100 dark:bg-slate-700 my-1" />
                                        <button
                                            onClick={() => handleDeleteClick(app.id!)}
                                            className="w-full text-left px-4 py-2 text-[11px] text-red-500 dark:text-red-400 font-bold hover:bg-red-50 dark:hover:bg-red-950/50"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 md:gap-3 mb-4 md:mb-6">
                                <span className={`px-2 md:px-3 py-1 text-[9px] md:text-[10px] font-bold uppercase tracking-wider rounded-lg border ${getStatusBadgeStyle(app.status)}`}>
                                    {app.status}
                                </span>
                                <span className="text-[10px] md:text-[11px] text-slate-400 dark:text-slate-500 font-medium flex items-center gap-1">
                                    Applied {app.application_date ? new Date(app.application_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Today'}
                                </span>
                            </div>

                            <div className="flex justify-between items-center pt-4 md:pt-5 border-t border-slate-50 dark:border-slate-800">
                                <div className="flex items-center gap-1.5 text-slate-400 dark:text-slate-500 text-[11px] md:text-xs font-medium min-w-0 flex-1">
                                    <img src={locationIcon} className="w-3 h-3 md:w-3.5 md:h-3.5 opacity-40 dark:opacity-30 flex-shrink-0" alt="loc" />
                                    <span className="truncate">{app.location || "Remote"}</span>
                                </div>
                                <button
                                    onClick={() => navigate(`/applications/${app.id}`)}
                                    className="text-blue-600 dark:text-blue-400 text-[11px] md:text-xs font-bold hover:underline underline-offset-4 flex-shrink-0 ml-2"
                                >
                                    Details
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="flex-1 flex flex-col items-center justify-center bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-[2.5rem] text-center px-4 md:px-6 py-12 md:py-20 mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-blue-50/50 dark:bg-blue-950/20 rounded-full flex items-center justify-center mb-6 md:mb-8">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-blue-100 dark:bg-blue-900/30 rounded-2xl md:rounded-3xl rotate-12 flex items-center justify-center">
                            <img src={activeIcon} className="w-8 h-8 md:w-10 md:h-10 -rotate-12 opacity-60 dark:opacity-40" alt="empty" />
                        </div>
                    </div>
                    <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white mb-2 md:mb-3">No applications found</h2>
                    <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-sm mb-6 md:mb-10 leading-relaxed px-4">
                        {searchTerm || filter !== "All"
                            ? "Try adjusting your search or filters to find what you're looking for."
                            : "Your career journey starts here. Add your first job application to begin tracking your progress."}
                    </p>
                    <button
                        onClick={handleOpenAddModal}
                        className="bg-[#2563EB] text-white px-6 md:px-10 py-3 md:py-4 rounded-xl md:rounded-2xl text-sm font-bold shadow-xl shadow-blue-200 dark:shadow-blue-900/30 hover:bg-blue-700 transition-all transform active:scale-95"
                    >
                        + Add Job Application
                    </button>
                </div>
            )}

            {/* DELETE CONFIRMATION MODAL - Responsive */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Application</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 md:mb-8">
                        Are you sure you want to delete this application? This action cannot be undone.
                    </p>
                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-5 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleExecuteDelete}
                            className="px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-200 dark:shadow-none"
                        >
                            Delete Permanently
                        </button>
                    </div>
                </div>
            </Modal>

            {/* FORM MODAL - Responsive */}
            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                        {editingId ? "Edit Application" : "New Application"}
                    </h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                        {editingId ? "Update your job application details." : "Log your latest job application details."}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Company</label>
                            <input
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="Apple"
                                value={formData.company_name}
                                onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Job Title</label>
                            <input
                                required
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="UX Designer"
                                value={formData.job_title}
                                onChange={(e) => setFormData({ ...formData, job_title: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Application Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                                value={formData.application_date}
                                onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Location (Optional)</label>
                            <input
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="Hybrid / Remote"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Job Link (Optional)</label>
                            <input
                                type="url"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white dark:placeholder:text-slate-500"
                                placeholder="https://linkedin.com/..."
                                value={formData.job_link}
                                onChange={(e) => setFormData({ ...formData, job_link: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Job Description (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[80px] resize-none transition-all dark:text-white dark:placeholder:text-slate-500"
                            placeholder="Paste requirements or job summary here..."
                            value={formData.job_description}
                            onChange={(e) => setFormData({ ...formData, job_description: e.target.value })}
                        />
                    </div>

                    <div className="bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 space-y-3">
                        <div className="flex justify-between items-center">
                            <label className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Resume Document (Optional)</label>
                            <div className="flex p-1 bg-slate-200/50 dark:bg-slate-700 rounded-lg">
                                <button
                                    type="button"
                                    onClick={() => setResumeMode("select")}
                                    className={`px-2 md:px-3 py-1 text-[9px] font-bold rounded-md transition-all ${resumeMode === 'select'
                                        ? 'bg-white dark:bg-slate-600 text-blue-600 dark:text-blue-400 shadow-sm'
                                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                                        }`}
                                >
                                    SELECT
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setResumeMode("upload")}
                                    className={`px-2 md:px-3 py-1 text-[9px] font-bold rounded-md transition-all ${resumeMode === 'upload'
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
                                value={formData.resume_id || ""}
                                onChange={(e) => setFormData({ ...formData, resume_id: Number(e.target.value) })}
                            >
                                <option value="">No Resume Selected</option>
                                {resumes.map(r => <option key={r.id} value={r.id}>{r.file_name}</option>)}
                            </select>
                        ) : (
                            <input
                                type="file"
                                className="w-full text-xs text-slate-500 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-[10px] file:font-black file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer bg-white dark:bg-slate-800 p-1.5 rounded-2xl border border-dashed border-slate-300 dark:border-slate-600 dark:text-slate-400"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) setSelectedFile(file);
                                }}
                            />
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Notes (Optional)</label>
                        <textarea
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none min-h-[70px] resize-none transition-all dark:text-white dark:placeholder:text-slate-500"
                            placeholder="Referral from..."
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col-reverse sm:flex-row justify-end gap-3 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
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
                            {loading ? "Processing..." : editingId ? "Update Application" : "Track Application"}
                        </button>
                    </div>
                </form>
            </Modal>

            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
        </div>
    );
}

export default Applications;