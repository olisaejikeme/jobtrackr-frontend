import { useState } from "react";
import UploadResumeModal from "../components/UploadResumeModal";

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

    const hasResumes = resumes.length > 0;

    return (
        <div className="h-full flex flex-col p-8 max-w-7xl mx-auto bg-[#F8FAFC] dark:bg-slate-950 transition-colors duration-300">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8 shrink-0">
                <div>
                    <h1 className="text-3xl font-bold text-[#0F172A] dark:text-white tracking-tight">
                        My Resumes
                    </h1>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                        Manage your resume versions and keep your documents organized.
                    </p>
                </div>

                {hasResumes && (
                    <div className="flex gap-3">
                        <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-300 shadow-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                            <img src={FilterIcon} alt="filter" className="w-4 h-4 dark:opacity-60" />
                            Filter
                        </button>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all active:scale-95"
                        >
                            <span className="text-lg leading-none">+</span> Upload
                        </button>
                    </div>
                )}
            </div>

            {/* UPLOAD ZONE */}
            <div
                onClick={() => setIsUploadOpen(true)}
                className="mb-8 group cursor-pointer bg-white dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-10 flex flex-col items-center justify-center transition-all hover:border-blue-400 hover:bg-blue-50/30 dark:hover:bg-blue-950/20 shrink-0"
            >
                <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                    <img src={UploadIcon} alt="upload" className="w-6 h-6 dark:opacity-70" />
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Click to upload or drag and drop
                </h3>

                <p className="text-slate-400 dark:text-slate-500 text-[10px] mt-1 uppercase tracking-[0.1em] font-black">
                    PDF, DOCX up to 10MB
                </p>
            </div>

            {/* TABLE / EMPTY STATE */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-sm flex flex-col flex-1 min-h-0 overflow-hidden">

                {hasResumes ? (
                    <>
                        <div className="overflow-y-auto flex-1">
                            <table className="w-full text-left border-collapse">
                                <thead className="sticky top-0 bg-slate-50 dark:bg-slate-800 z-10">
                                    <tr className="border-b border-slate-100 dark:border-slate-800">
                                        <th className="py-4 px-8 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider w-24">
                                            Type
                                        </th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Resume Name
                                        </th>
                                        <th className="py-4 px-6 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                            Date Uploaded
                                        </th>
                                        <th className="py-4 px-8 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-right">
                                            Actions
                                        </th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                                    {resumes.map((resume) => (
                                        <tr key={resume.id} className="group hover:bg-slate-50/30 dark:hover:bg-slate-800/40 transition-colors">

                                            <td className="py-5 px-8">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${resume.type === 'pdf'
                                                    ? 'bg-red-50 dark:bg-red-950/40'
                                                    : 'bg-blue-50 dark:bg-blue-950/40'
                                                    }`}>
                                                    <img src={FileIcon} alt="file" className="w-5 h-5 dark:opacity-70" />
                                                </div>
                                            </td>

                                            <td className="py-5 px-6">
                                                <p className="font-semibold text-slate-800 dark:text-white text-sm">
                                                    {resume.name}
                                                </p>
                                                <p className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 font-medium">
                                                    {resume.size}
                                                </p>
                                            </td>

                                            <td className="py-5 px-6 text-slate-500 dark:text-slate-400 text-sm font-medium">
                                                {resume.uploaded_at}
                                            </td>

                                            <td className="py-5 px-8 text-right">
                                                <button className="p-2.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg transition-colors group/btn">
                                                    <img src={TrashIcon} alt="delete" className="w-5 h-5 opacity-30 dark:opacity-40 group-hover/btn:opacity-100 transition-opacity" />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="px-8 py-4 border-t border-slate-50 dark:border-slate-800 flex items-center justify-between bg-white dark:bg-slate-900 shrink-0">
                            <p className="text-sm text-slate-400 dark:text-slate-500 font-medium">
                                Showing {resumes.length} results
                            </p>

                            <div className="flex gap-6">
                                <button className="text-[11px] font-black text-slate-300 dark:text-slate-600 uppercase tracking-widest cursor-not-allowed">
                                    Previous
                                </button>
                                <button className="text-[11px] font-black text-slate-500 dark:text-slate-300 uppercase tracking-widest hover:text-blue-600 dark:hover:text-blue-400">
                                    Next
                                </button>
                            </div>
                        </div>
                    </>
                ) : (
                    /* EMPTY STATE */
                    <div className="flex-1 flex flex-col items-center justify-center p-12 text-center">
                        <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
                            <img src={FileIcon} alt="no files" className="w-10 h-10 opacity-20 dark:opacity-30" />
                        </div>

                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                            No resumes uploaded yet
                        </h3>

                        <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-2">
                            Upload your first resume to start tracking your applications and get AI-powered insights.
                        </p>

                        <button
                            onClick={() => setIsUploadOpen(true)}
                            className="mt-6 px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 dark:shadow-blue-900/30 transition-all"
                        >
                            Get Started
                        </button>
                    </div>
                )}
            </div>

            <UploadResumeModal
                isOpen={isUploadOpen}
                onClose={() => setIsUploadOpen(false)}
            />
        </div>
    );
}

export default Resumes;