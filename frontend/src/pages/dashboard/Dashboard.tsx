const Dashboard = () => {
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Dashboard
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Overview of your operations.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Customers
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        —
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Products
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        —
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Low Stock
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        —
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Challans
                    </p>
                    <p className="mt-2 text-2xl font-bold">
                        —
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;