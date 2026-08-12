interface Challan {
    id: number;
    challanNumber: string;
    status: string;
    totalQuantity: number;
    createdAt: string;

    customer: {
        id: number;
        name: string;
        businessName: string | null;
    };

    createdBy?: {
        id: number;
        name: string;
        role: string;
    };
}

interface RecentChallansProps {
    challans: Challan[];
}

const RecentChallans = ({
    challans
}: RecentChallansProps) => {
    return (
        <div className="rounded-xl border bg-white">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                    Recent Challans
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Latest sales challan activity
                </p>
            </div>

            <div className="divide-y">
                {challans.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">
                        No challans found.
                    </p>
                ) : (
                    challans.map((challan) => (
                        <div
                            key={challan.id}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {challan.challanNumber}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {challan.customer.businessName ||
                                        challan.customer.name}
                                </p>
                            </div>

                            <div className="text-right">
                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">
                                    {challan.status}
                                </span>

                                <p className="mt-2 text-xs text-gray-500">
                                    {challan.totalQuantity} items
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentChallans;