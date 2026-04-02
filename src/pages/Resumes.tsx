import Button from "../components/Button";
import { useState } from "react";

type Resume = {
    id: number;
    name: string;
    uploaded_at: string;
};

function Resumes() {
    const [resumes] = useState<Resume[]>([]); // replace later with API

    const isEmpty = resumes.length === 0;

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">
                        Resumes
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Manage your resume versions for different roles
                    </p>
                </div>

                <Button>+ Upload Resume</Button>
            </div>

            {/* EMPTY STATE */}
            {isEmpty ? (
                <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">

                    <div className="text-4xl mb-4">📄</div>

                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                        No resumes uploaded
                    </h3>

                    <p className="text-sm text-gray-500 mb-6 max-w-sm">
                        Upload your first resume to start applying faster and track different versions.
                    </p>

                    <Button>+ Upload your first resume</Button>
                </div>
            ) : (
                /* GRID */
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                    {resumes.map((resume) => (
                        <div
                            key={resume.id}
                            className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition cursor-pointer"
                        >
                            {/* ICON */}
                            <div className="text-3xl mb-4">📄</div>

                            {/* NAME */}
                            <h3 className="font-semibold text-[#0F172A] mb-1 truncate">
                                {resume.name}
                            </h3>

                            {/* DATE */}
                            <p className="text-xs text-gray-500 mb-4">
                                Uploaded {resume.uploaded_at}
                            </p>

                            {/* ACTIONS */}
                            <div className="flex justify-between items-center text-sm">
                                <button className="text-gray-500 hover:underline">
                                    View
                                </button>

                                <button className="text-red-600 hover:underline">
                                    Delete
                                </button>
                            </div>
                        </div>
                    ))}

                </div>
            )}
        </div>
    );
}

export default Resumes;