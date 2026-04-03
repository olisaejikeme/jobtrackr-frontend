import { useState, useRef } from "react";
import Modal from "./Modal";
import UploadIcon from "../assets/icons/upload.svg";

type Props = {
    isOpen: boolean;
    onClose: () => void;
};

function UploadResumeModal({ isOpen, onClose }: Props) {
    const [fileName, setFileName] = useState("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <div className="w-full max-w-xl bg-white rounded-[32px] shadow-2xl p-10 mx-4 relative">

                {/* HEADER */}
                <div className="flex justify-between items-start mb-8">
                    <div>
                        <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">
                            Upload Resume
                        </h2>
                        <p className="text-sm text-slate-500 mt-1">
                            Get AI feedback on your latest version.
                        </p>
                    </div>

                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>

                {/* UPLOAD BOX */}
                <input type="file" ref={fileInputRef} className="hidden" accept=".pdf,.doc,.docx" />

                <div
                    onClick={() => fileInputRef.current?.click()}
                    className="group border-2 border-dashed border-slate-200 rounded-[24px] p-12 text-center mb-8 bg-slate-50/50 hover:bg-blue-50/50 hover:border-blue-300 transition-all cursor-pointer"
                >
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                        <img src={UploadIcon} alt="upload" className="w-6 h-6 opacity-60" />
                    </div>
                    <p className="text-sm font-bold text-slate-700">Click to upload or drag and drop</p>
                    <p className="text-[11px] text-slate-400 mt-2 font-bold uppercase tracking-wider">PDF, DOCX (Max 10MB)</p>
                </div>

                {/* FILENAME INPUT */}
                <div className="mb-10">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Display Name <span className="lowercase font-medium opacity-60">(optional)</span>
                    </label>
                    <input
                        value={fileName}
                        onChange={(e) => setFileName(e.target.value)}
                        placeholder="e.g. Senior_Dev_v1"
                        className="w-full mt-2 py-3 bg-transparent border-b-2 border-slate-100 focus:border-[#137FEC] outline-none text-sm font-medium transition-colors placeholder:text-slate-300"
                    />
                </div>

                {/* FOOTER */}
                <div className="flex justify-between items-center pt-8 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <span className="text-green-500 text-sm">🔒</span> Secure
                    </div>

                    <button className="bg-[#137FEC] hover:bg-blue-700 text-white px-10 py-3.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-100 transition-all active:scale-95 whitespace-nowrap flex-shrink-0">
                        Upload Resume
                    </button>
                </div>
            </div>
        </Modal>
    );
}

export default UploadResumeModal;