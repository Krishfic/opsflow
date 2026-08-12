import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import {
    useAppSelector
} from "../../app/hooks";

import {
    canCreateProduct,
    canEditProduct
} from "../../utils/permissions";

import {
    getProducts
} from "../../api/product.api";

import type {
    Product
} from "../../types/product";

const Products = () => {
    const navigate = useNavigate();

    const user = useAppSelector(
        (state) => state.auth.user
    );

    const [products, setProducts] =
        useState<Product[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const [search, setSearch] =
        useState("");

    const [lowStock, setLowStock] =
        useState(false);

    const [page, setPage] =
        useState(1);

    const [totalPages, setTotalPages] =
        useState(1);

    const limit = 10;

    const loadProducts = async (
        requestedPage = page
    ) => {
        try {
            setLoading(true);
            setError("");

            const response =
                await getProducts({
                    page: requestedPage,
                    limit,
                    search:
                        search.trim() ||
                        undefined,
                    lowStock
                });

            setProducts(
                response.products
            );

            setTotalPages(
                response.pagination.totalPages
            );
        } catch (error) {
            console.error(error);

            if (axios.isAxiosError(error)) {
                setError(
                    error.response?.data?.message ||
                        "Failed to load products"
                );
            } else {
                setError(
                    "Failed to load products"
                );
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProducts();
    }, [page, lowStock]);

    const handleSearch = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        setPage(1);
        loadProducts(1);
    };

    return (
        <div className="space-y-6">

            {/* Header */}

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage products and inventory.
                    </p>
                </div>

                {/* Only ADMIN and WAREHOUSE */}

                {user &&
                    canCreateProduct(
                        user.role
                    ) && (
                        <button
                            onClick={() =>
                                navigate(
                                    "/products/new"
                                )
                            }
                            className="rounded-lg bg-black px-4 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            + Add Product
                        </button>
                    )}

            </div>

            {/* Filters */}

            <div className="rounded-xl border bg-white p-4">

                <form
                    onSubmit={handleSearch}
                    className="flex flex-col gap-3 sm:flex-row"
                >

                    <input
                        type="text"
                        value={search}
                        onChange={(event) =>
                            setSearch(
                                event.target.value
                            )
                        }
                        placeholder="Search by name, SKU or category..."
                        className="flex-1 rounded-lg border px-3 py-2.5 text-sm outline-none focus:border-black"
                    />

                    <button
                        type="submit"
                        className="rounded-lg border px-4 py-2.5 text-sm font-medium hover:bg-gray-50"
                    >
                        Search
                    </button>

                    <label className="flex items-center gap-2 rounded-lg border px-4 py-2.5 text-sm">

                        <input
                            type="checkbox"
                            checked={lowStock}
                            onChange={(event) => {
                                setLowStock(
                                    event.target.checked
                                );

                                setPage(1);
                            }}
                        />

                        Low Stock Only

                    </label>

                </form>

            </div>

            {/* Error */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                    <p className="text-sm text-red-700">
                        {error}
                    </p>
                </div>
            )}

            {/* Loading / Empty / Table */}

            {loading ? (
                <div className="rounded-xl border bg-white p-10 text-center">
                    <p className="text-sm text-gray-500">
                        Loading products...
                    </p>
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-white p-10 text-center">

                    <p className="font-medium text-gray-900">
                        No products found
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                        Try changing your search or filters.
                    </p>

                </div>
            ) : (
                <div className="overflow-hidden rounded-xl border bg-white">

                    <div className="overflow-x-auto">

                        <table className="w-full text-left">

                            <thead className="border-b bg-gray-50">

                                <tr>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        SKU
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Category
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Price
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Stock
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Location
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Status
                                    </th>

                                    <th className="px-5 py-3" />

                                </tr>

                            </thead>

                            <tbody className="divide-y">

                                {products.map(
                                    (product) => {

                                        const isLowStock =
                                            product.currentStock <=
                                            product.minimumStock;

                                        return (
                                            <tr
                                                key={
                                                    product.id
                                                }
                                                className="hover:bg-gray-50"
                                            >

                                                {/* SKU */}

                                                <td className="px-5 py-4 text-sm font-medium text-gray-900">
                                                    {product.sku}
                                                </td>

                                                {/* Product */}

                                                <td className="px-5 py-4 text-sm">

                                                    <button
                                                        onClick={() =>
                                                            navigate(
                                                                `/products/${product.id}`
                                                            )
                                                        }
                                                        className="font-medium text-gray-900 hover:underline"
                                                    >
                                                        {
                                                            product.name
                                                        }
                                                    </button>

                                                </td>

                                                {/* Category */}

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {
                                                        product.category
                                                    }
                                                </td>

                                                {/* Price */}

                                                <td className="px-5 py-4 text-sm text-gray-700">
                                                    ₹
                                                    {Number(
                                                        product.unitPrice
                                                    ).toFixed(
                                                        2
                                                    )}
                                                </td>

                                                {/* Stock */}

                                                <td className="px-5 py-4 text-sm text-gray-700">
                                                    {
                                                        product.currentStock
                                                    }
                                                </td>

                                                {/* Location */}

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {
                                                        product.location
                                                    }
                                                </td>

                                                {/* Status */}

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                                                            isLowStock
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-green-100 text-green-700"
                                                        }`}
                                                    >
                                                        {isLowStock
                                                            ? "LOW STOCK"
                                                            : "IN STOCK"}
                                                    </span>

                                                </td>

                                                {/* Actions */}

                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-3">

                                                        <button
                                                            onClick={() =>
                                                                navigate(
                                                                    `/products/${product.id}`
                                                                )
                                                            }
                                                            className="text-sm font-medium text-gray-900 underline underline-offset-2"
                                                        >
                                                            View
                                                        </button>

                                                        {/* Only ADMIN and WAREHOUSE */}

                                                        {user &&
                                                            canEditProduct(
                                                                user.role
                                                            ) && (
                                                                <button
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/products/${product.id}/edit`
                                                                        )
                                                                    }
                                                                    className="text-sm font-medium text-gray-600 underline underline-offset-2"
                                                                >
                                                                    Edit
                                                                </button>
                                                            )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}

                            </tbody>

                        </table>

                    </div>

                </div>
            )}

            {/* Pagination */}

            {!loading &&
                products.length > 0 && (
                    <div className="flex items-center justify-between">

                        <button
                            disabled={
                                page === 1
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current - 1
                                )
                            }
                            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Previous
                        </button>

                        <p className="text-sm text-gray-500">
                            Page {page} of{" "}
                            {totalPages}
                        </p>

                        <button
                            disabled={
                                page ===
                                totalPages
                            }
                            onClick={() =>
                                setPage(
                                    (current) =>
                                        current + 1
                                )
                            }
                            className="rounded-lg border px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Next
                        </button>

                    </div>
                )}

        </div>
    );
};

export default Products;