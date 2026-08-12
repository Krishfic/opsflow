import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import {
    getChallans
} from "../../api/challan.api";

const Challans = () => {
    const [challans, setChallans] =
        useState<any[]>([]);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                const response =
                    await getChallans({
                        limit: 100
                    });

                setChallans(
                    response.challans
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">
                        Challans
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage sales challans.
                    </p>
                </div>

                <Link
                    to="/challans/new"
                    className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white"
                >
                    Create Challan
                </Link>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white">

                {loading ? (
                    <div className="p-10 text-center text-sm text-gray-500">
                        Loading challans...
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">

                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-xs uppercase text-gray-500">
                                        Challan
                                    </th>

                                    <th className="px-5 py-3 text-xs uppercase text-gray-500">
                                        Customer
                                    </th>

                                    <th className="px-5 py-3 text-xs uppercase text-gray-500">
                                        Quantity
                                    </th>

                                    <th className="px-5 py-3 text-xs uppercase text-gray-500">
                                        Status
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {challans.map(
                                    (challan) => (
                                        <tr
                                            key={
                                                challan.id
                                            }
                                            className="hover:bg-gray-50"
                                        >
                                            <td className="px-5 py-4 text-sm font-medium">
                                                <Link
                                                    to={`/challans/${challan.id}`}
                                                    className="hover:underline"
                                                >
                                                    {
                                                        challan.challanNumber
                                                    }
                                                </Link>
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    challan.customer
                                                        ?.businessName ||
                                                    challan.customer
                                                        ?.name
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    challan.totalQuantity
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium">
                                                    {
                                                        challan.status
                                                    }
                                                </span>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>

                        </table>
                    </div>
                )}

            </div>

        </div>
    );
};

export default Challans;