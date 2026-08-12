import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
    getCustomerById,
    getCustomerFollowUps,
    addCustomerFollowUp,
} from "../../api/customer.api";

import { useAppSelector } from "../../app/hooks";

import type {
    Customer,
    CustomerFollowUp
} from "../../types/customer";


const CustomerDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const user = useAppSelector(
        (state) => state.auth.user
    );

    const [customer, setCustomer] =
        useState<Customer | null>(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [followUps, setFollowUps] =
        useState<CustomerFollowUp[]>([]);

    const [followUpsLoading, setFollowUpsLoading] =
        useState(true);

    const [followUpError, setFollowUpError] =
        useState("");

    const [followUpNote, setFollowUpNote] =
        useState("");

    const [followUpDate, setFollowUpDate] =
        useState("");

    const [addingFollowUp, setAddingFollowUp] =
        useState(false);


    /*
     * Frontend RBAC
     *
     * ADMIN and SALES can:
     * - Edit customers
     * - Add follow-ups
     *
     * ACCOUNTS can:
     * - View customer details
     * - View follow-up history
     *
     * ACCOUNTS cannot:
     * - Edit customers
     * - Add follow-ups
     */
    const canEditCustomer =
        user?.role === "ADMIN" ||
        user?.role === "SALES";

    const canAddFollowUp =
        user?.role === "ADMIN" ||
        user?.role === "SALES";


    useEffect(() => {
        if (!id) {
            return;
        }

        const loadCustomer = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await getCustomerById(Number(id));

                setCustomer(response.customer);

                await loadFollowUps(
                    response.customer.id
                );
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    setError(
                        error.response?.data?.message ||
                        "Failed to load customer"
                    );
                } else {
                    setError(
                        "Failed to load customer"
                    );
                }
            } finally {
                setLoading(false);
            }
        };

        loadCustomer();
    }, [id]);


    const loadFollowUps = async (
        customerId: number
    ) => {
        try {
            setFollowUpsLoading(true);
            setFollowUpError("");

            const response =
                await getCustomerFollowUps(
                    customerId
                );

            setFollowUps(
                response.followUps
            );
        } catch (error) {
            console.error(
                "Failed to load follow-ups:",
                error
            );

            setFollowUpError(
                "Failed to load follow-up history."
            );
        } finally {
            setFollowUpsLoading(false);
        }
    };


    const handleAddFollowUp = async (
        event: React.SubmitEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        if (!id) {
            return;
        }

        try {
            setAddingFollowUp(true);
            setFollowUpError("");

            await addCustomerFollowUp(
                Number(id),
                {
                    note: followUpNote.trim(),
                    followUpDate
                }
            );

            setFollowUpNote("");
            setFollowUpDate("");

            await loadFollowUps(
                Number(id)
            );
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setFollowUpError(
                    error.response?.data?.message ||
                    "Failed to add follow-up."
                );
            } else {
                setFollowUpError(
                    "Failed to add follow-up."
                );
            }
        } finally {
            setAddingFollowUp(false);
        }
    };


    if (loading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-sm text-gray-500">
                    Loading customer...
                </p>
            </div>
        );
    }


    if (error || !customer) {
        return (
            <div className="space-y-4">

                <button
                    onClick={() =>
                        navigate("/customers")
                    }
                    className="text-sm text-gray-500 hover:text-gray-900"
                >
                    ← Back to Customers
                </button>

                <div className="rounded-xl border border-red-200 bg-red-50 p-5">
                    <p className="text-sm text-red-700">
                        {error ||
                            "Customer not found"}
                    </p>
                </div>

            </div>
        );
    }


    return (
        <div className="mx-auto max-w-5xl space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                <div>

                    <button
                        onClick={() =>
                            navigate("/customers")
                        }
                        className="mb-3 text-sm text-gray-500 hover:text-gray-900"
                    >
                        ← Back to Customers
                    </button>


                    <div className="flex flex-wrap items-center gap-3">

                        <h1 className="text-2xl font-bold text-gray-900">
                            {customer.name}
                        </h1>


                        <span
                            className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                customer.status ===
                                "ACTIVE"
                                    ? "bg-green-100 text-green-700"
                                    : customer.status ===
                                      "LEAD"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-600"
                            }`}
                        >
                            {customer.status}
                        </span>

                    </div>


                    <p className="mt-1 text-sm text-gray-500">
                        Customer ID: #{customer.id}
                    </p>

                </div>


                {/* Edit Customer - ADMIN / SALES only */}

                {canEditCustomer && (
                    <button
                        onClick={() =>
                            navigate(
                                `/customers/${customer.id}/edit`
                            )
                        }
                        className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                    >
                        Edit Customer
                    </button>
                )}

            </div>


            {/* Contact Information */}

            <section className="rounded-xl border bg-white">

                <div className="border-b px-5 py-4">

                    <h2 className="font-semibold text-gray-900">
                        Contact Information
                    </h2>

                </div>


                <div className="grid gap-5 p-5 sm:grid-cols-2">

                    <InfoItem
                        label="Mobile"
                        value={customer.mobile}
                    />

                    <InfoItem
                        label="Email"
                        value={
                            customer.email ||
                            "Not provided"
                        }
                    />

                    <InfoItem
                        label="Address"
                        value={customer.address}
                    />

                    <InfoItem
                        label="Customer Type"
                        value={
                            customer.customerType
                        }
                    />

                </div>

            </section>


            {/* Business Information */}

            <section className="rounded-xl border bg-white">

                <div className="border-b px-5 py-4">

                    <h2 className="font-semibold text-gray-900">
                        Business Information
                    </h2>

                </div>


                <div className="grid gap-5 p-5 sm:grid-cols-2">

                    <InfoItem
                        label="Business Name"
                        value={
                            customer.businessName ||
                            "Not provided"
                        }
                    />

                    <InfoItem
                        label="GST Number"
                        value={
                            customer.gstNumber ||
                            "Not provided"
                        }
                    />

                </div>

            </section>


            {/* Follow-up */}

            <section className="rounded-xl border bg-white">

                <div className="border-b px-5 py-4">

                    <h2 className="font-semibold text-gray-900">
                        Follow-up History
                    </h2>

                    <p className="mt-1 text-sm text-gray-500">
                        Track customer follow-ups and notes.
                    </p>

                </div>


                <div className="p-5">

                    {/* Add Follow-up - ADMIN / SALES only */}

                    {canAddFollowUp && (
                        <form
                            onSubmit={handleAddFollowUp}
                            className="mb-8 rounded-lg border bg-gray-50 p-4"
                        >

                            <h3 className="mb-4 text-sm font-semibold text-gray-900">
                                Add Follow-up
                            </h3>


                            <div className="grid gap-4 md:grid-cols-2">

                                <div>

                                    <label
                                        htmlFor="followUpDate"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Follow-up Date *
                                    </label>


                                    <input
                                        id="followUpDate"
                                        type="date"
                                        value={
                                            followUpDate
                                        }
                                        onChange={(event) =>
                                            setFollowUpDate(
                                                event.target.value
                                            )
                                        }
                                        required
                                        className="w-full rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
                                    />

                                </div>


                                <div className="md:col-span-2">

                                    <label
                                        htmlFor="followUpNote"
                                        className="mb-1.5 block text-sm font-medium text-gray-700"
                                    >
                                        Note *
                                    </label>


                                    <textarea
                                        id="followUpNote"
                                        value={
                                            followUpNote
                                        }
                                        onChange={(event) =>
                                            setFollowUpNote(
                                                event.target.value
                                            )
                                        }
                                        required
                                        rows={3}
                                        placeholder="What happened during the follow-up?"
                                        className="w-full resize-none rounded-lg border bg-white px-3 py-2.5 text-sm outline-none focus:border-black"
                                    />

                                </div>

                            </div>


                            <div className="mt-4 flex justify-end">

                                <button
                                    type="submit"
                                    disabled={
                                        addingFollowUp
                                    }
                                    className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    {addingFollowUp
                                        ? "Adding..."
                                        : "Add Follow-up"}
                                </button>

                            </div>

                        </form>
                    )}


                    {/* Error */}

                    {followUpError && (
                        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 p-3">

                            <p className="text-sm text-red-700">
                                {followUpError}
                            </p>

                        </div>
                    )}


                    {/* Loading */}

                    {followUpsLoading ? (

                        <div className="py-10 text-center">

                            <p className="text-sm text-gray-500">
                                Loading follow-up history...
                            </p>

                        </div>

                    ) : followUps.length === 0 ? (

                        <div className="rounded-lg border border-dashed p-8 text-center">

                            <p className="font-medium text-gray-900">
                                No follow-ups yet
                            </p>

                            <p className="mt-1 text-sm text-gray-500">
                                {canAddFollowUp
                                    ? "Add the first follow-up for this customer."
                                    : "No follow-ups have been recorded for this customer."}
                            </p>

                        </div>

                    ) : (

                        <div className="space-y-4">

                            {followUps.map(
                                (followUp) => (

                                    <div
                                        key={
                                            followUp.id
                                        }
                                        className="rounded-lg border p-4"
                                    >

                                        <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">

                                            <div>

                                                <p className="font-medium text-gray-900">
                                                    Follow-up
                                                </p>

                                                <p className="text-xs text-gray-500">
                                                    Scheduled for{" "}
                                                    {new Date(
                                                        followUp.followUpDate
                                                    ).toLocaleDateString()}
                                                </p>

                                            </div>


                                            <p className="text-xs text-gray-400">
                                                Recorded{" "}
                                                {new Date(
                                                    followUp.createdAt
                                                ).toLocaleString()}
                                            </p>

                                        </div>


                                        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-gray-700">
                                            {
                                                followUp.note
                                            }
                                        </p>


                                        <p className="mt-3 text-xs text-gray-500">

                                            Added by{" "}

                                            <span className="font-medium text-gray-700">
                                                {
                                                    followUp
                                                        .createdBy
                                                        .name
                                                }
                                            </span>

                                            {" · "}

                                            {
                                                followUp
                                                    .createdBy
                                                    .role
                                            }

                                        </p>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </section>


            {/* Notes */}

            <section className="rounded-xl border bg-white">

                <div className="border-b px-5 py-4">

                    <h2 className="font-semibold text-gray-900">
                        Notes
                    </h2>

                </div>


                <div className="p-5">

                    <p className="whitespace-pre-wrap text-sm leading-6 text-gray-600">
                        {customer.notes ||
                            "No notes added."}
                    </p>

                </div>

            </section>

        </div>
    );
};


interface InfoItemProps {
    label: string;
    value: string;
}


const InfoItem = ({
    label,
    value
}: InfoItemProps) => {

    return (
        <div>

            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                {label}
            </p>

            <p className="mt-1 text-sm text-gray-900">
                {value}
            </p>

        </div>
    );
};


export default CustomerDetails;