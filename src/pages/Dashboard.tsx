import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getApplications, deleteApplication } from "../services/applicationService";
import { getResumes } from "../services/resumeService";
import type { Resume } from "../services/resumeService";
import Modal from "../components/Modal";
import Toast from "../components/Toast";

// Icons
import appliedIcon from "../assets/icons/applied.svg";
import rejectedIcon from "../assets/icons/rejected.svg";
import interviewIcon from "../assets/icons/interview.svg";
import offerIcon from "../assets/icons/offer.svg";
import totalIcon from "../assets/icons/total.svg";
import emptyFolderImage from "/empty-folder.png";
import moreIcon from "../assets/icons/more.svg";

function Dashboard() {
    const navigate = useNavigate();
    const [applications, setApplications] = useState<any[]>([]);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [idToDelete, setIdToDelete] = useState<number | null>(null);
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

    // Resume Logic States
    const [resumeMode, setResumeMode] = useState<"select" | "upload">("select");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            console.error("Error fetching dashboard data:", error);
            setToast({ message: "Failed to load data", type: "error" });
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
        setResumeMode(resumes.length > 0 ? "select" : "upload");
    };

    const handleAddApplication = async (e: React.FormEvent) => {
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
            if (selectedFile) formDataToSend.append("file", selectedFile);

            const token = localStorage.getItem("access_token");
            const BASE_URL = import.meta.env.VITE_API_BASE_URL;

            const response = await fetch(`${BASE_URL}/applications`, {
                method: "POST",
                headers: { Authorization: token ? `Bearer ${token}` : "" },
                body: formDataToSend,
            });

            if (!response.ok) throw new Error("Submission failed");

            setToast({ message: "Application tracked!", type: "success" });
            setIsModalOpen(false);
            await fetchData();
            resetForm();
        } catch (error) {
            console.error("Add application error:", error);
            setToast({ message: "Check required fields and try again.", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    // Delete handlers
    const handleDeleteClick = (id: number) => {
        setIdToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleExecuteDelete = async () => {
        if (!idToDelete) return;
        try {
            await deleteApplication(idToDelete);
            setToast({ message: "Deleted successfully", type: "success" });
            await fetchData();
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
        } catch {
            setToast({ message: "Failed to delete", type: "error" });
            setIsDeleteModalOpen(false);
            setIdToDelete(null);
        }
    };

    // Calculate stats based on actual status values
    const stats = [
        { title: "Total Apps", value: applications.length, icon: totalIcon },
        { title: "Applied", value: applications.filter((a) => a.status?.toUpperCase() === "APPLIED").length, icon: appliedIcon },
        { title: "Interview", value: applications.filter((a) => a.status?.toUpperCase() === "INTERVIEW" || a.status?.toUpperCase() === "INTERVIEWING").length, icon: interviewIcon },
        { title: "Rejected", value: applications.filter((a) => a.status?.toUpperCase() === "REJECTED").length, icon: rejectedIcon },
        { title: "Offer", value: applications.filter((a) => a.status?.toUpperCase() === "OFFER" || a.status?.toUpperCase() === "OFFER RECEIVED").length, icon: offerIcon },
    ];

    function getStatusBadgeStyle(status: string) {
        const upperStatus = status?.toUpperCase() || "";
        switch (upperStatus) {
            case "INTERVIEW":
            case "INTERVIEWING":
                return "bg-orange-50 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-900";
            case "OFFER":
            case "OFFER RECEIVED":
                return "bg-green-50 dark:bg-green-950/50 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900";
            case "REJECTED":
                return "bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900";
            default:
                return "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900";
        }
    }

    const Sidebar = () => (
        <div className="flex flex-col gap-4 lg:gap-6 h-full shrink-0">
            <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-3xl p-5 relative overflow-hidden grayscale opacity-70">
                <div className="absolute top-4 right-4 bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400 text-[8px] font-black px-2 py-0.5 rounded-md uppercase tracking-tighter">Coming Soon</div>
                <div className="w-9 h-9 bg-slate-200 dark:bg-slate-700 rounded-xl flex items-center justify-center mb-3 text-sm">✨</div>
                <h4 className="font-bold text-slate-400 dark:text-slate-500 text-sm mb-1.5 tracking-tight">AI Resume Feedback</h4>
                <p className="text-slate-400 dark:text-slate-500 text-[11px] font-medium mb-4 leading-normal">Upload your resume to get instant AI-powered feedback.</p>
                <button disabled className="w-full py-2 bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 text-[11px] font-bold rounded-lg cursor-not-allowed">Locked</button>
            </div>
            <div className="bg-blue-50/50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-3xl p-5 shadow-sm">
                <div className="flex items-center gap-2 text-blue-500 dark:text-blue-400 mb-2">
                    <span className="text-sm">💡</span>
                    <span className="text-[9px] font-black uppercase tracking-widest">Pro Tip</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400 text-[11px] font-medium leading-normal">Consistency is key. Try to track at least 3 applications a week.</p>
            </div>
        </div>
    );

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col p-6 lg:p-8 space-y-4 lg:space-y-6 overflow-hidden bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">
            {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

            {/* DELETE CONFIRMATION MODAL */}
            <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)}>
                <div className="p-2">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Delete Application</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mb-8">
                        Are you sure you want to delete this application? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            onClick={() => setIsDeleteModalOpen(false)}
                            className="px-5 py-2.5 text-xs font-bold text-slate-500 dark:text-slate-400"
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

            <div className="flex justify-between items-start shrink-0">
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Dashboard</h1>
                    <p className="text-slate-400 dark:text-slate-500 text-xs font-medium mt-0.5">Your job search progress overview</p>
                </div>
                <button onClick={() => {
                    resetForm();
                    setIsModalOpen(true);
                }} className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-xs font-bold shadow-md transition-all active:scale-95">+ Add Job Application</button>
            </div>

            <div className="grid grid-cols-5 gap-4 lg:gap-6 shrink-0">
                {stats.map((s, i) => (
                    <div key={i} className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 flex flex-col justify-between h-24 shadow-sm hover:border-slate-200 dark:hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-2">
                            <img src={s.icon} className="w-3.5 h-3.5 opacity-60 dark:opacity-40" alt="" />
                            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{s.title}</span>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white leading-none">{s.value}</h2>
                    </div>
                ))}
            </div>

            <div className="flex-1 min-h-0">
                <div className="grid grid-cols-3 gap-6 h-full">
                    <div className="col-span-2 min-h-0 h-full">
                        {applications.length > 0 ? (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm h-full flex flex-col overflow-hidden">
                                <div className="p-4 flex justify-between items-center border-b border-slate-50 dark:border-slate-800 shrink-0">
                                    <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm">Recent Applications</h3>
                                </div>
                                <div className="flex-1 overflow-y-auto px-6">
                                    <table className="w-full text-left border-separate border-spacing-0">
                                        <thead className="sticky top-0 bg-white dark:bg-slate-900 z-10">
                                            <tr className="text-[10px] uppercase tracking-widest text-slate-400 dark:text-slate-500 font-black">
                                                <th className="py-4 border-b border-slate-50 dark:border-slate-800">Company</th>
                                                <th className="py-4 border-b border-slate-50 dark:border-slate-800">Job Title</th>
                                                <th className="py-4 border-b border-slate-50 dark:border-slate-800">Status</th>
                                                <th className="py-4 border-b border-slate-50 dark:border-slate-800 text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                            {applications.slice(0, 5).map((app: any) => (
                                                <tr key={app.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group cursor-pointer" onClick={() => navigate(`/applications/${app.id}`)}>
                                                    <td className="py-3 font-bold text-sm text-slate-700 dark:text-slate-300">{app.company_name}</td>
                                                    <td className="py-3 text-xs text-slate-600 dark:text-slate-400 font-semibold">{app.job_title}</td>
                                                    <td className="py-3">
                                                        <span className={`px-2.5 py-1 rounded-full border text-[9px] font-black uppercase tracking-tight ${getStatusBadgeStyle(app.status)}`}>
                                                            {app.status}
                                                        </span>
                                                    </td>
                                                    <td className="py-3 text-right">
                                                        <div className="relative group/menu" onClick={(e) => e.stopPropagation()}>
                                                            <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors">
                                                                <img src={moreIcon} className="w-5 h-5 opacity-40 dark:opacity-30" alt="options" />
                                                            </button>
                                                            <div className="invisible group-hover/menu:visible absolute right-0 top-10 w-36 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xl rounded-2xl py-2 z-20">
                                                                <button
                                                                    onClick={() => navigate(`/applications/${app.id}`)}
                                                                    className="w-full text-left px-4 py-2 text-[11px] text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-50 dark:hover:bg-slate-700"
                                                                >
                                                                    View Details
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
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    {applications.length > 5 && (
                                        <div className="py-4 text-center border-t border-slate-50 dark:border-slate-800">
                                            <button
                                                onClick={() => navigate("/applications")}
                                                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline"
                                            >
                                                View all {applications.length} applications →
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl flex flex-col items-center justify-center p-12 text-center shadow-sm h-full overflow-hidden">
                                <img
                                    src={emptyFolderImage}
                                    alt="No applications"
                                    className="w-32 h-32 mb-6 opacity-60 dark:opacity-40"
                                />
                                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">No applications tracked yet</h3>
                                <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Start by adding your first job application</p>
                                <button
                                    onClick={() => {
                                        resetForm();
                                        setIsModalOpen(true);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95"
                                >
                                    + Add Job Application
                                </button>
                            </div>
                        )}
                    </div>
                    <Sidebar />
                </div>
            </div>

            {/* ADD/EDIT FORM MODAL */}
            <Modal isOpen={isModalOpen} onClose={() => {
                setIsModalOpen(false);
                resetForm();
            }}>
                <div className="mb-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">New Application</h2>
                    <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Log your latest job application details.</p>
                </div>

                <form onSubmit={handleAddApplication} className="space-y-4 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 gap-4">
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
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Application Date</label>
                            <input
                                type="date"
                                className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all dark:text-white"
                                value={formData.application_date}
                                onChange={(e) => setFormData({ ...formData, application_date: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
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

                    <div className="flex justify-end gap-3 pt-4 sticky bottom-0 bg-white dark:bg-slate-900 pb-2">
                        <button
                            type="button"
                            onClick={() => {
                                setIsModalOpen(false);
                                resetForm();
                            }}
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
        </div>
    );
}

export default Dashboard;