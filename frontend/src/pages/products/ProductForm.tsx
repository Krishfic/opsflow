import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { createProduct } from "../../api/product.api";

import type {
    CreateProductData
} from "../../types/product";

const ProductForm = () => {
    const navigate = useNavigate();

    const [formData, setFormData] =
        useState<CreateProductData>({
            name: "",
            sku: "",
            category: "",
            unitPrice: 0,
            minimumStock: 0,
            location: ""
        });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const handleChange = (
        event: React.ChangeEvent<HTMLInputElement>
    ) => {
        const { name, value } = event.target;

        setFormData((current) => ({
            ...current,
            [name]:
                name === "unitPrice" ||
                name === "minimumStock"
                    ? Number(value)
                    : value
        }));
    };

    const handleSubmit = async (
        event: React.FormEvent<HTMLFormElement>
    ) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");

            await createProduct(formData);

            navigate("/products");
        } catch (error) {
            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to create product"
                );
            } else {
                setError(
                    "Failed to create product"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mx-auto max-w-3xl space-y-6">
            {/* Header */}

            <div>
                <button
                    type="button"
                    onClick={() =>
                        navigate("/products")
                    }
                    className="mb-3 text-sm text-gray-500 hover:text-gray-900"
                >
                    ← Back to Products
                </button>

                <h1 className="text-2xl font-bold text-gray-900">
                    Add Product
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new product.
                </p>
            </div>

            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="rounded-xl border bg-white p-6"
            >
                <div className="grid gap-5 md:grid-cols-2">

                    {/* Product Name */}

                    <div>
                        <label
                            htmlFor="name"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Product Name *
                        </label>

                        <input
                            id="name"
                            name="name"
                            type="text"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            minLength={2}
                            placeholder="Enter product name"
                            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* SKU */}

                    <div>
                        <label
                            htmlFor="sku"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            SKU *
                        </label>

                        <input
                            id="sku"
                            name="sku"
                            type="text"
                            value={formData.sku}
                            onChange={handleChange}
                            required
                            placeholder="e.g. PROD-001"
                            className="w-full rounded-lg border px-3 py-2.5 text-sm uppercase outline-none focus:border-black"
                        />
                    </div>

                    {/* Category */}

                    <div>
                        <label
                            htmlFor="category"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Category *
                        </label>

                        <input
                            id="category"
                            name="category"
                            type="text"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Electronics"
                            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Unit Price */}

                    <div>
                        <label
                            htmlFor="unitPrice"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Unit Price *
                        </label>

                        <input
                            id="unitPrice"
                            name="unitPrice"
                            type="number"
                            value={
                                formData.unitPrice
                            }
                            onChange={handleChange}
                            required
                            min="0.01"
                            step="0.01"
                            placeholder="0.00"
                            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
                        />
                    </div>

                    {/* Minimum Stock */}

                    <div>
                        <label
                            htmlFor="minimumStock"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Minimum Stock *
                        </label>

                        <input
                            id="minimumStock"
                            name="minimumStock"
                            type="number"
                            value={
                                formData.minimumStock
                            }
                            onChange={handleChange}
                            required
                            min="0"
                            step="1"
                            placeholder="0"
                            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
                        />

                        <p className="mt-1 text-xs text-gray-400">
                            Low-stock warning threshold.
                        </p>
                    </div>

                    {/* Location */}

                    <div>
                        <label
                            htmlFor="location"
                            className="mb-1.5 block text-sm font-medium text-gray-700"
                        >
                            Location *
                        </label>

                        <input
                            id="location"
                            name="location"
                            type="text"
                            value={
                                formData.location
                            }
                            onChange={handleChange}
                            required
                            placeholder="e.g. Rack A-12"
                            className="w-full rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
                        />
                    </div>
                </div>

                {/* Stock Information */}

                <div className="mt-6 rounded-lg border border-blue-100 bg-blue-50 p-4">
                    <p className="text-sm font-medium text-blue-900">
                        Initial Stock
                    </p>

                    <p className="mt-1 text-sm text-blue-700">
                        New products start with 0 stock.
                        Use Stock IN after creating the
                        product to add inventory.
                    </p>
                </div>

                {/* Actions */}

                <div className="mt-6 flex justify-end gap-3 border-t pt-5">
                    <button
                        type="button"
                        onClick={() =>
                            navigate("/products")
                        }
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
                            ? "Creating..."
                            : "Create Product"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProductForm;