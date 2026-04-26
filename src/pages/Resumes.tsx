import { useState, useEffect } from "react";
import UploadResumeModal from "../components/UploadResumeModal";
import { getResumes, deleteResume } from "../services/resumeService";
import type { Resume as ApiResume } from "../services/resumeService";

import FilterIcon from "../assets/icons/filter.svg";
import TrashIcon from "../assets/icons/trash.svg";
import FileIcon from "../assets/icons/pdf-file.svg";
import UploadIcon from "../assets/icons/upload.svg";

type Resume = {
    id: number;
    name: string;
    size: string;
    uploaded_at: string;
    type: "pdf" | "docx";
};

function Resumes() {
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [loading, setLoading] = useState(true);
    const [isMobile, setIsMobile] = useState(false);

    // Check mobile screen size
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await getResumes();

            if (response.status && Array.isArray(response.data)) {
                const mappedResumes: Resume[] = response.data.map((r: ApiResume) => {
                    const dateStr = r.uploaded_at || r.created_at;

                    return {
                        id: r.id,
                        name: r.file_name,
                        size: "N/A",
                        uploaded_at: dateStr ? new Date(dateStr).toLocaleDateString() : "N/A",
                        type: r.file_name.toLowerCase().endsWith(".pdf") ? "pdf" : "docx",
                    };
                });
                setResumes(mappedResumes);
            }
        } catch (error) {
            console.error("Failed to fetch resumes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!window.confirm("Are you sure you want to delete this resume?")) return;
        try {
            await deleteResume(id);
            setResumes(prev => prev.filter(r => r.id !== id));
        } catch (error) {
            console.error("Delete failed:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const hasResumes = resumes.length > 0;

    return (
        <div className="h-full flex flex-col p-4 md:p-6 lg:p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">

            {/* HEADER - Responsive */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6 md:mb-8 shrink-0">
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                        My Resumes
                    </h1>
                    <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your resume versions and keep your documents organized.
                    </p>
                </div>

                {hasResumes && (
                    <div className="flex gap-3 w-full sm:w-auto">
                        <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <img src={FilterIcon} alt="filter" className="w-4 h-4 dark:opacity-60" />
                            <span className="hidden sm:inline">Filter</span>
                        </button>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all active:scale-95"
                        >
                            <span className="text-lg leading-none">+</span>
                            <span>{isMobile ? "Upload" : "Upload Resume"}</span>
                        </button>
                    </div>
                )}
            </div>

            {/* UPLOAD ZONE - Responsive */}
            <div
                onClick={() => setIsUploadOpen(true)}
                className="mb-6 md:mb-8 group cursor-pointer bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl p-6 md:p-10 flex flex-col items-center justify-center transition-all hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 shrink-0"
            >
                <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 dark:bg-blue-950/50 rounded-full flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform">
                    <img src={UploadIcon} alt="upload" className="w-5 h-5 md:w-6 md:h-6 dark:opacity-70" />
                </div>

                <h3 className="text-sm md:text-base font-bold text-slate-900 dark:text-white text-center">
                    {isMobile ? "Tap to upload" : "Click to upload or drag and drop"}
                </h3>

                <p className="text-slate-400 dark:text-slate-500 text-[9px] md:text-[10px] mt-1 uppercase tracking-[0.1em] font-black">
                    PDF, DOCX up to 10MB
                </p>
            </div>

            {/* TABLE / EMPTY STATE - Responsive */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl md:rounded-3xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">

                {loading ? (
                    <div className="flex-1 flex items-center justify-center text-slate-500 py-12">
                        <div className="animate-pulse flex flex-col items-center gap-2">
                            <div className="h-8 w-8 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                            <span className="text-sm">Loading your resumes...</span>
                        </div>
                    </div>
                ) : hasResumes ? (
                    <>
                        {/* Mobile Card View */}
                        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
                            {resumes.map((resume) => (
                                <div key={resume.id} className="p-4 hover:bg-slate-50/30 dark:hover:bg-slate-800/40 transition-colors">
                                    <div className="flex items-start justify-between mb-3">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${resume.type === 'pdf'
                                                ? 'bg-red-50 dark:bg-red-950/40'
                                                : 'bg-blue-50 dark:bg-blue-950/40'
                                                }`}>
                                                <img src={FileIcon} alt="file" className="w-5 h-5 dark:opacity-70" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate">
                                                    {resume.name}
                                                </p>
                                                <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-0.5">
                                                    {resume.size}
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => handleDelete(resume.id)}
                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors flex-shrink-0 ml-2"
                                        >
                                            <img src={TrashIcon} alt="delete" className="w-4 h-4 opacity-40 dark:opacity-50" />
                                        </button>
                                    </div>
                                    <div className="text-xs text-slate-500 dark:text-slate-400">
                                        Uploaded: {resume.uploaded_at}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Desktop Table View */}
                        <div className="hidden md:block overflow-y-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="py-4 px-6 lg:px-8 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24">
                                            Type
                                        </th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Resume Name
                                        </th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Date Uploaded
                                        </th>
                                        <th className="py-4 px-6 lg:px-8 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {resumes.map((resume) => (
                                        <tr key={resume.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/40 transition-colors">
                                            <td className="py-5 px-6 lg:px-8">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${resume.type === 'pdf'
                                                    ? 'bg-red-50 dark:bg-red-950/40'
                                                    : 'bg-blue-50 dark:bg-blue-950/40'
                                                    }`}>
                                                    <img src={FileIcon} alt="file" className="w-5 h-5 dark:opacity-70" />
                                                </div>
                                            </td>

                                            <td className="py-5 px-6">
                                                <p className="font-semibold text-slate-800 dark:text-white text-sm truncate max-w-[200px] lg:max-w-none">
                                                    {resume.name}
                                                </p>
                                                <p className="text-[11px] lg:text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                                                    {resume.size}
                                                </p>
                                            </td>

                                            <td className="py-5 px-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                                {resume.uploaded_at}
                                            </td>

                                            <td className="py-5 px-6 lg:px-8 text-right">
                                                <button
                                                    onClick={() => handleDelete(resume.id)}
                                                    className="p-2 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors group/btn"
                                                >
                                                    <img src={TrashIcon} alt="delete" className="w-5 h-5 opacity-30 dark:opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Footer with pagination */}
                        <div className="px-4 md:px-6 lg:px-8 py-4 border-t border-slate-50 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 shrink-0">
                            <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 font-medium">
                                Showing {resumes.length} result{resumes.length !== 1 ? 's' : ''}
                            </p>

                            <div className="flex gap-6">
                                <button className="text-[10px] md:text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest cursor-not-allowed">
                                    Previous
                                </button>
                                <button className="text-[10px] md:text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400">
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* EMPTY STATE - Responsive */
                    <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-12 text-center">
                        <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <img src={FileIcon} alt="no files" className="w-8 h-8 md:w-10 md:h-10 opacity-20 dark:opacity-30" />
                        </div>

                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white">
                            No resumes uploaded yet
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-xs mt-2">
                            Upload your first resume to start tracking your applications and get AI-powered insights.
                        </p>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="mt-6 px-5 md:px-6 py-2 md:py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-xs md:text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            <UploadResumeModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
                onSuccess={fetchData}
            />
        </div>
    );
}

export default Resumes;