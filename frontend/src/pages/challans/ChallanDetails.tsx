import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  cancelChallan,
  confirmChallan,
  getChallan,
} from "../../api/challan.api";

interface ChallanItem {
  id: number;
  productId: number;
  productNameSnapshot: string;
  skuSnapshot: string;
  unitPriceSnapshot: string | number;
  quantity: number;
}

interface Challan {
  id: number;
  challanNumber: string;
  totalQuantity: number;
  status: "DRAFT" | "CONFIRMED" | "CANCELLED";

  customer: {
    id: number;
    name: string;
    businessName: string | null;
    mobile: string;
    email: string | null;
  };

  createdBy: {
    id: number;
    name: string;
    role: string;
  };

  items: ChallanItem[];
}

const ChallanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const [showCancelDialog, setShowCancelDialog] = useState(false);

  const [challan, setChallan] = useState<Challan | null>(null);

  const [loading, setLoading] = useState(true);

  const [processing, setProcessing] = useState(false);

  const [error, setError] = useState("");

  const loadChallan = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getChallan(Number(id));

      setChallan(response.challan);
    } catch (error) {
      console.error(error);

      setError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Failed to load challan"
          : "Failed to load challan",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadChallan();
    }
  }, [id]);

  const handleConfirm = async () => {
    if (!challan) return;

    try {
      setProcessing(true);
      setError("");

      await confirmChallan(challan.id);

      navigate("/challans", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setError(message || "Failed to confirm challan");
    } finally {
      setProcessing(false);
      setShowConfirmDialog(false);
    }
  };

  const handleCancel = async () => {
    if (!challan) return;

    try {
      setProcessing(true);
      setError("");

      await cancelChallan(challan.id);

      navigate("/challans", {
        replace: true,
      });
    } catch (error) {
      console.error(error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setError(message || "Failed to cancel challan");
    } finally {
      setProcessing(false);
      setShowCancelDialog(false);
    }
  };

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center text-sm text-gray-500">
        Loading challan...
      </div>
    );
  }

  if (!challan) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-gray-600">{error || "Challan not found"}</p>

        <Link
          to="/challans"
          className="mt-4 inline-block text-sm font-medium underline"
        >
          Back to Challans
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}

      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/challans"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to Challans
          </Link>

          <h1 className="mt-3 text-2xl font-bold">{challan.challanNumber}</h1>

          <p className="mt-1 text-sm text-gray-500">Sales Challan</p>
        </div>

        <span className="rounded-full bg-gray-100 px-3 py-1.5 text-sm font-medium">
          {challan.status}
        </span>
      </div>

      {/* Error */}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* Customer */}

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-semibold">Customer</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">Name</p>

            <p className="mt-1 text-sm font-medium">{challan.customer.name}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Business</p>

            <p className="mt-1 text-sm font-medium">
              {challan.customer.businessName || "-"}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Mobile</p>

            <p className="mt-1 text-sm font-medium">
              {challan.customer.mobile}
            </p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Created By</p>

            <p className="mt-1 text-sm font-medium">{challan.createdBy.name}</p>
          </div>
        </div>
      </div>

      {/* Items */}

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Items</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-xs uppercase text-gray-500">
                  Product
                </th>

                <th className="px-6 py-3 text-xs uppercase text-gray-500">
                  SKU
                </th>

                <th className="px-6 py-3 text-xs uppercase text-gray-500">
                  Unit Price
                </th>

                <th className="px-6 py-3 text-xs uppercase text-gray-500">
                  Quantity
                </th>
              </tr>
            </thead>

            <tbody className="divide-y">
              {challan.items.map((item) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-sm font-medium">
                    {item.productNameSnapshot}
                  </td>

                  <td className="px-6 py-4 text-sm text-gray-600">
                    {item.skuSnapshot}
                  </td>

                  <td className="px-6 py-4 text-sm">
                    ₹{Number(item.unitPriceSnapshot).toFixed(2)}
                  </td>

                  <td className="px-6 py-4 text-sm">{item.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end border-t px-6 py-4">
          <p className="text-sm font-semibold">
            Total Quantity: {challan.totalQuantity}
          </p>
        </div>
      </div>

      {/* Actions */}

      {challan.status === "DRAFT" && (
        <div className="flex justify-end gap-3">
          <button
            onClick={() => setShowCancelDialog(true)}
            disabled={processing}
            className="rounded-lg border px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
          >
            Cancel Challan
          </button>

          <button
            onClick={() => setShowConfirmDialog(true)}
            disabled={processing}
            className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
          >
            Confirm Challan
          </button>
        </div>
      )}

      {showConfirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Confirm Challan
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to confirm{" "}
              <span className="font-medium">{challan.challanNumber}</span>?
            </p>

            <p className="mt-3 rounded-lg bg-yellow-50 p-3 text-sm text-yellow-800">
              Confirming this challan will deduct the requested quantities from
              inventory.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowConfirmDialog(false)}
                disabled={processing}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleConfirm}
                disabled={processing}
                className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {processing ? "Confirming..." : "Confirm Challan"}
              </button>
            </div>
          </div>
        </div>
      )}

      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">
              Cancel Challan
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Are you sure you want to cancel{" "}
              <span className="font-medium">{challan.challanNumber}</span>?
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                disabled={processing}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
              >
                Go Back
              </button>

              <button
                type="button"
                onClick={handleCancel}
                disabled={processing}
                className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
              >
                {processing ? "Cancelling..." : "Cancel Challan"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChallanDetails;
