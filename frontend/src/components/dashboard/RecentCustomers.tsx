interface Customer {
    id: number;
    name: string;
    businessName: string | null;
    mobile: string;
    status: string;
    createdAt: string;
}

interface RecentCustomersProps {
    customers: Customer[];
}

const RecentCustomers = ({
    customers
}: RecentCustomersProps) => {
    return (
        <div className="rounded-xl border bg-white">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                    Recent Customers
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Recently added customers
                </p>
            </div>

            <div className="divide-y">
                {customers.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">
                        No customers found.
                    </p>
                ) : (
                    customers.map((customer) => (
                        <div
                            key={customer.id}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {customer.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {customer.businessName ||
                                        customer.mobile}
                                </p>
                            </div>

                            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                {customer.status}
                            </span>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentCustomers;