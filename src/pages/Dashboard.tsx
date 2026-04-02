import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";

import { useEffect, useState } from "react";
import { getApplications } from "../services/applicationService";

type Application = {
    id: number;
    company_name: string;
    job_title: string;
    status: string;
    application_date: string;
};

function Dashboard() {
    const [applications, setApplications] = useState<Application[]>([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const data = await getApplications();
                setApplications(data.data || []);
            } catch (error) {
                console.error(error);
            }
        }

        fetchData();
    }, []);

    const isEmpty = applications.length === 0;

    return (
        <div className="p-6">

            {/* HEADER */}
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-[#0F172A]">
                        Dashboard
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">
                        Welcome back. Here’s your overview.
                    </p>
                </div>

                <Button>+ Add Application</Button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                <Card>
                    <p className="text-sm text-gray-500 mb-1">
                        Active Applications
                    </p>
                    <h2 className="text-3xl font-bold text-[#0F172A]">
                        {applications.length}
                    </h2>
                </Card>

                <Card>
                    <p className="text-sm text-gray-500 mb-1">
                        Interviews
                    </p>
                    <h2 className="text-3xl font-bold text-[#0F172A]">
                        {applications.filter(a => a.status === "INTERVIEW").length}
                    </h2>
                </Card>

                <Card>
                    <p className="text-sm text-gray-500 mb-1">
                        Offers
                    </p>
                    <h2 className="text-3xl font-bold text-[#0F172A]">
                        {applications.filter(a => a.status === "OFFER").length}
                    </h2>
                </Card>

            </div>

            {/* CONTENT */}
            {isEmpty ? (
                /* EMPTY STATE */
                <div className="bg-white border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center shadow-sm">

                    <div className="text-4xl mb-4">📄</div>

                    <h3 className="text-lg font-semibold text-[#0F172A] mb-2">
                        No applications yet
                    </h3>

                    <p className="text-sm text-gray-500 mb-6 max-w-sm">
                        Start tracking your job applications by adding your first one.
                    </p>

                    <Button>+ Add your first application</Button>
                </div>
            ) : (
                /* TABLE STATE */
                <div className="bg-white border border-gray-200 rounded-2xl shadow-sm">

                    <div className="px-6 py-4 border-b">
                        <h3 className="font-semibold text-[#0F172A]">
                            Recent Applications
                        </h3>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="text-left text-gray-500 border-b bg-gray-50">
                                    <th className="py-3 px-6 font-medium">Company</th>
                                    <th className="px-6 font-medium">Role</th>
                                    <th className="px-6 font-medium">Status</th>
                                    <th className="px-6 font-medium">Date</th>
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
                                            <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                                                {app.status}
                                            </span>
                                        </td>

                                        <td className="px-6 text-gray-500">
                                            {app.application_date}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>
            )}
        </div>
    );
}

export default Dashboard;