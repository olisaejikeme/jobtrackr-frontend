import { useState, useRef } from "react";
import Modal from "./Modal";
import UploadIcon from "../assets/icons/upload.svg";
import { uploadResume } from "../services/resumeService";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void | Promise<void>; // Added to fix TS(2322)
}

function UploadResumeModal({ isOpen, onClose, onSuccess }: Props) {
    const [displayName, setDisplayName] = useState("");
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setSelectedFile(file);
            // Auto-fill display name if empty
            if (!displayName) setDisplayName(file.name);
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const response = await uploadResume(selectedFile, displayName);
            if (response.status) {
                setDisplayName("");
                setSelectedFile(null);
                await onSuccess(); // Refresh the list in parent
                onClose();
            }
        } catch (error) {
            console.error("Upload failed:", error);
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-[24px] md:rounded-[32px] shadow-2xl p-6 md:p-10 mx-4 relative border border-transparent dark:border-slate-800 transition-colors">
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0F172A] dark:text-white tracking-tight">Upload Resume</h2>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Get AI feedback on your latest version.</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full text-slate-400 transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.docx,.doc" onChange={handleFileChange} />

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`group border-2 border-dashed rounded-[24px] p-12 text-center mb-8 transition-all cursor-pointer 
                        ${selectedFile ? 'border-blue-500 bg-blue-50/30 dark:bg-blue-900/10' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-blue-50/50 dark:hover:bg-blue-900/20 hover:border-blue-300'}`}
                >
                    <div className="w-14 h-14 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <img src={UploadIcon} alt="upload" className="w-6 h-6 opacity-60 dark:invert" />
                    </div>
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-200">
                        {selectedFile ? selectedFile.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-2 font-bold uppercase tracking-wider">PDF, DOCX (Max 5MB)</p>
                </div>

                <div className="mb-10">
                    <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Display Name</label>
                    <input
                        value={displayName}
                        onChange={(e) => setDisplayName(e.target.value)}
                        placeholder="e.g. Software_Engineer_Resume"
                        className="w-full mt-2 py-3 bg-transparent border-b-2 border-slate-100 dark:border-slate-800 focus:border-[#137FEC] outline-none text-sm font-medium transition-colors text-slate-800 dark:text-white"
                    />
                </div>

                <div className="flex justify-between items-center pt-8 border-t border-slate-50 dark:border-slate-800">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="text-green-500 text-sm">🔒</span> Secure
                    </div>
                    <button
                        onClick={handleUpload}
                        disabled={!selectedFile || isUploading}
                        className="bg-[#137FEC] hover:bg-blue-700 disabled:bg-slate-300 dark:disabled:bg-slate-800 text-white px-10 py-3.5 rounded-2xl text-sm font-bold shadow-lg transition-all active:scale-95 flex-shrink-0"
                    >
                        {isUploading ? "Uploading..." : "Upload Resume"}
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default UploadResumeModal;