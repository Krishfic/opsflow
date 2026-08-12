import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  createCustomer,
  getCustomerById,
  updateCustomer,
} from "../../api/customer.api";

import type { CreateCustomerData } from "../../types/customer";

const CustomerForm = () => {
  const navigate = useNavigate();

  const { id } = useParams();

  const isEditMode = Boolean(id);

  const [initialLoading, setInitialLoading] = useState(isEditMode);

  const [formData, setFormData] = useState<CreateCustomerData>({
    name: "",
    mobile: "",
    email: "",
    businessName: "",
    gstNumber: "",
    customerType: "RETAIL",
    address: "",
    status: "LEAD",
    followUpDate: "",
    notes: "",
  });

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) {
      return;
    }

    const loadCustomer = async () => {
      try {
        setInitialLoading(true);
        setError("");

        const response = await getCustomerById(Number(id));

        const customer = response.customer;

        setFormData({
          name: customer.name,
          mobile: customer.mobile,
          email: customer.email ?? "",
          businessName: customer.businessName ?? "",
          gstNumber: customer.gstNumber ?? "",
          customerType: customer.customerType,
          address: customer.address,
          status: customer.status,
          followUpDate: customer.followUpDate
            ? customer.followUpDate.slice(0, 10)
            : "",
          notes: customer.notes ?? "",
        });
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to load customer");
        } else {
          setError("Failed to load customer");
        }
      } finally {
        setInitialLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const payload = {
        ...formData,
        email: formData.email || undefined,
        businessName: formData.businessName || undefined,
        gstNumber: formData.gstNumber || undefined,
        followUpDate: formData.followUpDate || undefined,
        notes: formData.notes || undefined,
      };

      if (isEditMode) {
        await updateCustomer(Number(id), payload);
      } else {
        await createCustomer(payload);
      }

      navigate("/customers");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(
          error.response?.data?.message ||
            `Failed to ${isEditMode ? "update" : "create"} customer`,
        );
      } else {
        setError(`Failed to ${isEditMode ? "update" : "create"} customer`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
        <div className="flex min-h-64 items-center justify-center">
            <p className="text-sm text-gray-500">
                Loading customer...
            </p>
        </div>
    );
}

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}

      <div>
        <button
          type="button"
          onClick={() => navigate("/customers")}
          className="mb-3 text-sm text-gray-500 hover:text-gray-900"
        >
          ← Back to Customers
        </button>

        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? "Edit Customer" : "Add Customer"}
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          {isEditMode
            ? "Update customer information."
            : "Create a new customer record."}
        </p>

        <p className="mt-1 text-sm text-gray-500">
          Create a new customer record.
        </p>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Form */}

      <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6">
        <div className="grid gap-5 md:grid-cols-2">
          {/* Name */}

          <div>
            <label
              htmlFor="name"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Customer Name *
            </label>

            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter customer name"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Mobile */}

          <div>
            <label
              htmlFor="mobile"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Mobile Number *
            </label>

            <input
              id="mobile"
              name="mobile"
              type="tel"
              value={formData.mobile}
              onChange={handleChange}
              required
              placeholder="Enter mobile number"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@example.com"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Business Name */}

          <div>
            <label
              htmlFor="businessName"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Business Name
            </label>

            <input
              id="businessName"
              name="businessName"
              type="text"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Enter business name"
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* GST */}

          <div>
            <label
              htmlFor="gstNumber"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              GST Number
            </label>

            <input
              id="gstNumber"
              name="gstNumber"
              type="text"
              value={formData.gstNumber}
              onChange={handleChange}
              placeholder="Optional GST number"
              className="w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:border-black"
            />
          </div>

          {/* Customer Type */}

          <div>
            <label
              htmlFor="customerType"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Customer Type *
            </label>

            <select
              id="customerType"
              name="customerType"
              value={formData.customerType}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="RETAIL">Retail</option>

              <option value="WHOLESALE">Wholesale</option>

              <option value="DISTRIBUTOR">Distributor</option>
            </select>
          </div>

          {/* Status */}

          <div>
            <label
              htmlFor="status"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Status *
            </label>

            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            >
              <option value="LEAD">Lead</option>

              <option value="ACTIVE">Active</option>

              <option value="INACTIVE">Inactive</option>
            </select>
          </div>

          {/* Follow-up Date */}

          <div>
            <label
              htmlFor="followUpDate"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Follow-up Date
            </label>

            <input
              id="followUpDate"
              name="followUpDate"
              type="date"
              value={formData.followUpDate}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Address */}

          <div className="md:col-span-2">
            <label
              htmlFor="address"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Address *
            </label>

            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter customer address"
              className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>

          {/* Notes */}

          <div className="md:col-span-2">
            <label
              htmlFor="notes"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Notes
            </label>

            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={4}
              placeholder="Add any notes about this customer..."
              className="w-full resize-none rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
            />
          </div>
        </div>

        {/* Actions */}

        <div className="mt-6 flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={() => navigate("/customers")}
            disabled={loading}
            className="rounded-lg border px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded-lg bg-black px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading
    ? isEditMode
        ? "Updating..."
        : "Creating..."
    : isEditMode
        ? "Update Customer"
        : "Create Customer"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CustomerForm;
