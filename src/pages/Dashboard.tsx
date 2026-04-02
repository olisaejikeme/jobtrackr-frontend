import Card from "../components/Card";
import Button from "../components/Button";
import Table from "../components/Table";

function Dashboard() {
    return (
        <div>
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Dashboard</h1>
                    <p className="text-sm text-gray-500">
                        Welcome back. Here’s your overview.
                    </p>
                </div>

                <Button>+ Add Application</Button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <Card>
                    <p className="text-sm text-gray-500">Active Applications</p>
                    <h2 className="text-2xl font-bold">24</h2>
                </Card>

                <Card>
                    <p className="text-sm text-gray-500">Interviews</p>
                    <h2 className="text-2xl font-bold">8</h2>
                </Card>

                <Card>
                    <p className="text-sm text-gray-500">Offers</p>
                    <h2 className="text-2xl font-bold">2</h2>
                </Card>
            </div>

            {/* Table */}
            <Table title="Recent Applications">
                <thead>
                    <tr className="text-left text-gray-500 border-b">
                        <th className="py-2">Company</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>

                <tbody>
                    <tr className="border-b">
                        <td className="py-2">Stripe</td>
                        <td>Product Designer</td>
                        <td className="text-blue-600">Interview</td>
                        <td>Oct 24</td>
                    </tr>
                </tbody>
            </Table>
        </div>
    );
}

export default Dashboard;