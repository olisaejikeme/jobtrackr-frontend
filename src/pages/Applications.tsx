import { useEffect, useState } from "react";
import Button from "../components/Button";
import Modal from "../components/Modal";
import {
    getApplications,
    createApplication,
    updateApplication,
    deleteApplication,
} from "../services/applicationService";
import Dropdown from "../components/Dropdown";
import Toast from "../components/Toast";

type Application = {
    id: number;
    company_name: string;
    job_title: string;
    status: string;
    application_date: string;
};

type ApplicationForm = {
    company_name: string;
    job_title: string;
    status: string;
};

function Applications() {
    const STATUS_OPTIONS = [
        "APPLIED",
        "INTERVIEW",
        "OFFER",
        "REJECTED",
    ];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [applications, setApplications] = useState<Application[]>([]);
    const [form, setForm] = useState<ApplicationForm>({
        company_name: "",
        job_title: "",
        status: "",
    });
    const [editingApp, setEditingApp] = useState<Application | null>(null);
    const [deleteId, setDeleteId] = useState<number | null>(null);
    const [toast, setToast] = useState<{
        message: string;
        type: "success" | "error";
    } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await getApplications();
                setApplications(res.data || []);
            } catch (error) {
                setToast({
                    message: "Failed to load applications",
                    type: "error",
                });
            }
        }

        fetchData();
    }, []);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    async function handleSubmit() {
        setLoading(true);
        try {
            if (editingApp) {
                const res = await updateApplication(editingApp.id, form);
                setApplications((prev) =>
                    prev.map((app) =>
                        app.id === editingApp.id ? res.data : app
                    )
                );
                setToast({ message: "Application updated", type: "success" });
            } else {
                const res = await createApplication(form);
                setApplications((prev) => [res.data, ...prev]);
                setToast({ message: "Application created", type: "success" });
            }

            setIsModalOpen(false);
            setEditingApp(null);
            setForm({ company_name: "", job_title: "", status: "" });
        } catch {
            setToast({
                message: editingApp
                    ? "Failed to update application"
                    : "Failed to create application",
                type: "error",
            });
        } finally {
            setLoading(false);
        }
    }

    function handleEdit(app: Application) {
        setEditingApp(app);
        setForm({
            company_name: app.company_name,
            job_title: app.job_title,
            status: app.status,
        });
        setIsModalOpen(true);
    }

    async function handleDelete(id: number) {
        try {
            await deleteApplication(id);
            setApplications((prev) =>
                prev.filter((app) => app.id !== id)
            );
            setToast({ message: "Application deleted", type: "success" });
        } catch {
            setToast({
                message: "Failed to delete application",
                type: "error",
            });
        }
    }

    const isEmpty = applications.length === 0;

    function getStatusStyle(status: string) {
        switch (status) {
            case "INTERVIEW":
                return "bg-blue-100 text-blue-700";
            case "OFFER":
                return "bg-green-100 text-green-700";
            case "REJECTED":
                return "bg-red-100 text-red-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    }

    return (
        <>
            <div className="p-6">

                {/* HEADER */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-[#0F172A]">
                            Applications
                        </h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Track and manage all your job applications
                        </p>
                    </div>

                    <Button onClick={() => setIsModalOpen(true)}>
                        + Add Application
                    </Button>
                </div>

                {/* EMPTY STATE */}
                {isEmpty ? (
                    <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center text-center shadow-sm">

                        <div className="text-4xl mb-4">📄</div>

                        <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                            No applications yet
                        </h3>

                        <p className="text-sm text-gray-500 mb-6 max-w-sm">
                            Start tracking your job applications by adding your first one.
                        </p>

                        <Button onClick={() => setIsModalOpen(true)}>
                            + Add your first application
                        </Button>
                    </div>
                ) : (
                    /* TABLE */
                    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">

                        <div className="px-6 py-4 border-b">
                            <h3 className="font-semibold text-[#0F172A]">
                                All Applications
                            </h3>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 bg-gray-50 border-b">
                                        <th className="py-3 px-6">Company</th>
                                        <th className="px-6">Role</th>
                                        <th className="px-6">Status</th>
                                        <th className="px-6">Date</th>
                                        <th className="px-6">Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {applications.map((app) => (
                                        <tr
                                            key={app.id}
                                            className="border-b hover:bg-gray-50 transition"
                                        >
                                            <td className="py-3 px-6 font-medium text-[#0F172A]">
                                                {app.company_name}
                                            </td>

                                            <td className="px-6 text-gray-600">
                                                {app.job_title}
                                            </td>

                                            <td className="px-6">
                                                <span
                                                    className={`px-2 py-1 text-xs rounded-full ${getStatusStyle(app.status)}`}
                                                >
                                                    {app.status}
                                                </span>
                                            </td>

                                            <td className="px-6 text-gray-500">
                                                {app.application_date}
                                            </td>

                                            <td className="px-6">
                                                <Dropdown
                                                    onEdit={() => handleEdit(app)}
                                                    onDelete={() => setDeleteId(app.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* FORM MODAL */}
                <Modal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setEditingApp(null);
                        setForm({
                            company_name: "",
                            job_title: "",
                            status: "",
                        });
                    }}
                >
                    <div className="w-full max-w-2xl px-2">

                        {/* HEADER */}
                        <h2 className="text-xl font-semibold text-[#0F172A] mb-1">
                            {editingApp ? "Edit Application" : "Add Application"}
                        </h2>

                        <p className="text-sm text-gray-500 mb-8">
                            Track a new job application and its progress.
                        </p>

                        {/* SECTION 1 */}
                        <div className="grid grid-cols-2 gap-x-6 gap-y-6 mb-8">

                            <div>
                                <label className="text-xs text-gray-500 font-medium">
                                    COMPANY NAME
                                </label>
                                <input
                                    name="company_name"
                                    placeholder="e.g. Acme Corp"
                                    value={form.company_name}
                                    onChange={handleChange}
                                    className="w-full mt-2 pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-[#0F172A]"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">
                                    JOB TITLE
                                </label>
                                <input
                                    name="job_title"
                                    placeholder="e.g. Senior Designer"
                                    value={form.job_title}
                                    onChange={handleChange}
                                    className="w-full mt-2 pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-[#0F172A]"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">
                                    STATUS
                                </label>

                                <select
                                    name="status"
                                    value={form.status}
                                    onChange={(e) =>
                                        setForm({ ...form, status: e.target.value })
                                    }
                                    className="w-full mt-2 pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-[#0F172A] cursor-pointer"
                                >
                                    <option value="" disabled>
                                        Select status
                                    </option>

                                    {STATUS_OPTIONS.map((status) => (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">
                                    LOCATION
                                </label>
                                <input
                                    placeholder="Remote / City"
                                    className="w-full mt-2 pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-[#0F172A]"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">
                                    APPLICATION DATE
                                </label>
                                <input
                                    type="date"
                                    className="w-full mt-2 pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-[#0F172A]"
                                />
                            </div>

                            <div>
                                <label className="text-xs text-gray-500 font-medium">
                                    RESUME VERSION
                                </label>
                                <input
                                    placeholder="Product_Designer_2023.pdf"
                                    className="w-full mt-2 pb-2 border-b border-gray-300 bg-transparent outline-none focus:border-[#0F172A]"
                                />
                            </div>
                        </div>

                        {/* SECTION 2 */}
                        <div className="mb-8">
                            <label className="text-xs text-gray-500 font-medium">
                                NOTES
                            </label>

                            <textarea
                                placeholder="Referral by Sam, found on LinkedIn..."
                                className="w-full mt-2 px-4 py-3 border border-gray-200 rounded-xl bg-[#F8FAFC] outline-none focus:ring-2 focus:ring-[#0F172A]"
                            />
                        </div>

                        {/* ACTIONS */}
                        <div className="flex justify-end items-center gap-4 pt-2 border-t border-gray-100">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="text-sm text-gray-500 hover:underline"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                disabled={loading}
                                className="bg-[#0F172A] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 disabled:opacity-50"
                            >
                                {loading ? "Saving..." : "Save Application"}
                            </button>
                        </div>
                    </div>
                </Modal>

                {/* DELETE MODAL */}
                <Modal
                    isOpen={deleteId !== null}
                    onClose={() => setDeleteId(null)}
                >
                    <h2 className="text-lg font-semibold mb-4">
                        Delete Application
                    </h2>

                    <p className="text-sm text-gray-600 mb-4">
                        Are you sure you want to delete this application?
                    </p>

                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
                        >
                            Cancel
                        </button>

                        <button
                            onClick={async () => {
                                if (deleteId !== null) {
                                    await handleDelete(deleteId);
                                    setDeleteId(null);
                                }
                            }}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Delete
                        </button>
                    </div>
                </Modal>
            </div>

            {/* TOAST */}
            {toast && (
                <Toast
                    message={toast.message}
                    type={toast.type}
                    onClose={() => setToast(null)}
                />
            )}
        </>
    );
}

export default Applications;