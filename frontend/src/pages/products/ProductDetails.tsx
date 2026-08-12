import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { useAppSelector } from "../../app/hooks";

import { canEditProduct, canManageStock } from "../../utils/permissions";

import { getProductById, stockIn, stockOut } from "../../api/product.api";

interface StockMovement {
  id: number;
  quantity: number;
  type: "IN" | "OUT";
  reason: string;
  createdAt: string;
  createdBy: {
    id: number;
    name: string;
    role: string;
  };
}

interface Product {
  id: number;
  name: string;
  sku: string;
  category: string;
  unitPrice: string | number;
  currentStock: number;
  minimumStock: number;
  location: string;
  stockMovements: StockMovement[];
}

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = useAppSelector((state) => state.auth.user);

  const [product, setProduct] = useState<Product | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [showStockDialog, setShowStockDialog] = useState<"IN" | "OUT" | null>(
    null,
  );

  const [stockQuantity, setStockQuantity] = useState("");

  const [stockReason, setStockReason] = useState("");

  const [stockProcessing, setStockProcessing] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const response = await getProductById(Number(id));

        setProduct(response.product);
      } catch (error) {
        console.error(error);

        setError(
          axios.isAxiosError(error)
            ? error.response?.data?.message || "Failed to load product"
            : "Failed to load product",
        );
      } finally {
        setLoading(false);
      }
    };

    loadProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="rounded-xl border bg-white p-10 text-center">
        <p className="text-gray-600">{error || "Product not found"}</p>

        <Link to="/products" className="mt-4 inline-block text-sm underline">
          Back to Products
        </Link>
      </div>
    );
  }

  const handleStockMovement = async () => {
    if (!product || !showStockDialog) {
      return;
    }

    const quantity = Number(stockQuantity);

    if (!Number.isInteger(quantity) || quantity <= 0) {
      setError("Quantity must be a positive whole number");
      return;
    }

    if (!stockReason.trim()) {
      setError("Reason is required");
      return;
    }

    if (showStockDialog === "OUT" && quantity > product.currentStock) {
      setError("Insufficient stock");
      return;
    }

    try {
      setStockProcessing(true);
      setError("");

      if (showStockDialog === "IN") {
        await stockIn(product.id, {
          quantity,
          reason: stockReason.trim(),
        });
      } else {
        await stockOut(product.id, {
          quantity,
          reason: stockReason.trim(),
        });
      }

      // Reload product so stock and
      // movement history are updated.
      const response = await getProductById(product.id);

      setProduct(response.product);

      setShowStockDialog(null);
      setStockQuantity("");
      setStockReason("");
    } catch (error) {
      console.error(error);

      const message = axios.isAxiosError(error)
        ? error.response?.data?.message
        : undefined;

      setError(message || "Failed to update stock");
    } finally {
      setStockProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div>
          <Link
            to="/products"
            className="text-sm text-gray-500 hover:underline"
          >
            ← Back to Products
          </Link>

          <h1 className="mt-3 text-2xl font-bold">{product.name}</h1>

          <p className="mt-1 text-sm text-gray-500">{product.sku}</p>
        </div>

        <div className="flex flex-wrap gap-3">
          {user && canManageStock(user.role) && (
            <>
              <button
                type="button"
                onClick={() => setShowStockDialog("IN")}
                className="rounded-lg border border-green-600 px-4 py-2 text-sm font-medium text-green-700 hover:bg-green-50"
              >
                Stock In
              </button>

              <button
                type="button"
                onClick={() => setShowStockDialog("OUT")}
                className="rounded-lg border border-red-600 px-4 py-2 text-sm font-medium text-red-700 hover:bg-red-50"
              >
                Stock Out
              </button>
            </>
          )}

          {user && canEditProduct(user.role) && (
            <button
              type="button"
              onClick={() => navigate(`/products/${product.id}/edit`)}
              className="rounded-lg bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Edit Product
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Category</p>
          <p className="mt-2 font-semibold">{product.category}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Unit Price</p>
          <p className="mt-2 font-semibold">
            ₹{Number(product.unitPrice).toFixed(2)}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Current Stock</p>
          <p className="mt-2 text-2xl font-bold">{product.currentStock}</p>
        </div>

        <div className="rounded-xl border bg-white p-5">
          <p className="text-sm text-gray-500">Minimum Stock</p>
          <p className="mt-2 text-2xl font-bold">{product.minimumStock}</p>
        </div>
      </div>

      <div className="rounded-xl border bg-white p-6">
        <h2 className="mb-4 font-semibold">Product Information</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs text-gray-500">SKU</p>

            <p className="mt-1 text-sm font-medium">{product.sku}</p>
          </div>

          <div>
            <p className="text-xs text-gray-500">Location</p>

            <p className="mt-1 text-sm font-medium">{product.location}</p>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white">
        <div className="border-b px-6 py-4">
          <h2 className="font-semibold">Stock Movement History</h2>
        </div>

        {product.stockMovements.length === 0 ? (
          <p className="p-8 text-center text-sm text-gray-500">
            No stock movements yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-xs uppercase text-gray-500">
                    Type
                  </th>

                  <th className="px-6 py-3 text-xs uppercase text-gray-500">
                    Quantity
                  </th>

                  <th className="px-6 py-3 text-xs uppercase text-gray-500">
                    Reason
                  </th>

                  <th className="px-6 py-3 text-xs uppercase text-gray-500">
                    Created By
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y">
                {product.stockMovements.map((movement) => (
                  <tr key={movement.id}>
                    <td className="px-6 py-4">
                      <span
                        className={
                          movement.type === "IN"
                            ? "text-sm font-semibold text-green-600"
                            : "text-sm font-semibold text-red-600"
                        }
                      >
                        {movement.type}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {movement.type === "IN" ? "+" : "-"}
                      {movement.quantity}
                    </td>

                    <td className="px-6 py-4 text-sm text-gray-600">
                      {movement.reason}
                    </td>

                    <td className="px-6 py-4 text-sm">
                      {movement.createdBy.name}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {showStockDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold">
              {showStockDialog === "IN" ? "Add Stock" : "Remove Stock"}
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              {showStockDialog === "IN"
                ? `Add stock for ${product.name}.`
                : `Remove stock from ${product.name}.`}
            </p>

            {showStockDialog === "OUT" && (
              <div className="mt-4 rounded-lg bg-gray-50 p-3 text-sm">
                Current stock:{" "}
                <span className="font-semibold">{product.currentStock}</span>
              </div>
            )}

            <div className="mt-5 space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Quantity
                </label>

                <input
                  type="number"
                  min="1"
                  value={stockQuantity}
                  onChange={(event) => setStockQuantity(event.target.value)}
                  placeholder="Enter quantity"
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Reason</label>

                <input
                  type="text"
                  value={stockReason}
                  onChange={(event) => setStockReason(event.target.value)}
                  placeholder={
                    showStockDialog === "IN"
                      ? "e.g. New purchase"
                      : "e.g. Damaged items"
                  }
                  className="w-full rounded-lg border px-3 py-2 outline-none focus:ring-2"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                disabled={stockProcessing}
                onClick={() => {
                  setShowStockDialog(null);
                  setStockQuantity("");
                  setStockReason("");
                }}
                className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={stockProcessing}
                onClick={handleStockMovement}
                className={
                  showStockDialog === "IN"
                    ? "rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                    : "rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                }
              >
                {stockProcessing
                  ? "Processing..."
                  : showStockDialog === "IN"
                    ? "Add Stock"
                    : "Remove Stock"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
