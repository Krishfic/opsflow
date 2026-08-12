import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { getProducts } from "../../api/product.api";

import type { Product } from "../../types/product";

const Inventory = () => {
    const navigate = useNavigate();

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

    const loadInventory = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getProducts({
                page: 1,
                limit: 100,
                search: search.trim() || undefined,
                lowStock
            });

            setProducts(response.products);
        } catch (error) {
            console.error(error);

            setError(
                axios.isAxiosError(error)
                    ? error.response?.data?.message ||
                          "Failed to load inventory"
                    : "Failed to load inventory"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadInventory();
    }, [lowStock]);

    const handleSearch = (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        loadInventory();
    };

    const totalUnits = products.reduce(
        (total, product) =>
            total + product.currentStock,
        0
    );

    const lowStockCount = products.filter(
        (product) =>
            product.currentStock <=
            product.minimumStock
    ).length;

    return (
        <div className="space-y-6">

            {/* Header */}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">
                    Inventory
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Monitor current stock and low-stock products.
                </p>
            </div>

            {/* Summary */}

            <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Products
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {products.length}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Total Units
                    </p>

                    <p className="mt-2 text-2xl font-bold">
                        {totalUnits}
                    </p>
                </div>

                <div className="rounded-xl border bg-white p-5">
                    <p className="text-sm text-gray-500">
                        Low Stock
                    </p>

                    <p className="mt-2 text-2xl font-bold text-red-600">
                        {lowStockCount}
                    </p>
                </div>

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
                        placeholder="Search by product, SKU or category..."
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
                            onChange={(event) =>
                                setLowStock(
                                    event.target.checked
                                )
                            }
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

            {/* Table */}

            {loading ? (
                <div className="rounded-xl border bg-white p-10 text-center">
                    <p className="text-sm text-gray-500">
                        Loading inventory...
                    </p>
                </div>
            ) : products.length === 0 ? (
                <div className="rounded-xl border border-dashed bg-white p-10 text-center">
                    <p className="font-medium">
                        No inventory items found
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

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        Product
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        SKU
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        Category
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        Current Stock
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        Minimum Stock
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        Location
                                    </th>

                                    <th className="px-5 py-3 text-xs font-semibold uppercase text-gray-500">
                                        Status
                                    </th>

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
                                                key={product.id}
                                                onClick={() =>
                                                    navigate(
                                                        `/products/${product.id}`
                                                    )
                                                }
                                                className="cursor-pointer hover:bg-gray-50"
                                            >

                                                <td className="px-5 py-4 text-sm font-medium">
                                                    {product.name}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {product.sku}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {product.category}
                                                </td>

                                                <td className="px-5 py-4 text-sm font-semibold">
                                                    {product.currentStock}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {product.minimumStock}
                                                </td>

                                                <td className="px-5 py-4 text-sm text-gray-600">
                                                    {product.location}
                                                </td>

                                                <td className="px-5 py-4">

                                                    <span
                                                        className={
                                                            isLowStock
                                                                ? "rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700"
                                                                : "rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700"
                                                        }
                                                    >
                                                        {isLowStock
                                                            ? "LOW STOCK"
                                                            : "IN STOCK"}
                                                    </span>

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

        </div>
    );
};

export default Inventory;