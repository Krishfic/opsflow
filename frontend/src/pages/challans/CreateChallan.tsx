import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import api from "../../api/axios";
import {
    createChallan
} from "../../api/challan.api";

interface Customer {
    id: number;
    name: string;
    businessName: string | null;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    currentStock: number;
    unitPrice: string | number;
}

interface ChallanItem {
    productId: number;
    productName: string;
    sku: string;
    quantity: number;
    unitPrice: number;
}

const CreateChallan = () => {
    const navigate = useNavigate();

    const [customers, setCustomers] =
        useState<Customer[]>([]);

    const [products, setProducts] =
        useState<Product[]>([]);

    const [customerId, setCustomerId] =
        useState("");

    const [productId, setProductId] =
        useState("");

    const [quantity, setQuantity] =
        useState(1);

    const [items, setItems] =
        useState<ChallanItem[]>([]);

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    useEffect(() => {
        const loadData = async () => {
            try {
                const [
                    customersResponse,
                    productsResponse
                ] = await Promise.all([
                    api.get("/customers", {
                        params: {
                            limit: 100
                        }
                    }),

                    api.get("/products", {
                        params: {
                            limit: 100
                        }
                    })
                ]);

                setCustomers(
                    customersResponse.data.customers
                );

                setProducts(
                    productsResponse.data.products
                );
            } catch (error) {
                console.error(error);

                setError(
                    "Failed to load customers and products"
                );
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    const addItem = () => {
        setError("");

        const product =
            products.find(
                (item) =>
                    item.id === Number(productId)
            );

        if (!product) {
            setError("Please select a product");
            return;
        }

        if (quantity <= 0) {
            setError(
                "Quantity must be greater than zero"
            );
            return;
        }

        if (
            quantity > product.currentStock
        ) {
            setError(
                `Only ${product.currentStock} units available`
            );
            return;
        }

        if (
            items.some(
                (item) =>
                    item.productId === product.id
            )
        ) {
            setError(
                "This product is already added"
            );
            return;
        }

        setItems([
            ...items,
            {
                productId: product.id,
                productName: product.name,
                sku: product.sku,
                quantity,
                unitPrice: Number(
                    product.unitPrice
                )
            }
        ]);

        setProductId("");
        setQuantity(1);
    };

    const removeItem = (
        productId: number
    ) => {
        setItems(
            items.filter(
                (item) =>
                    item.productId !== productId
            )
        );
    };

    const handleSubmit = async () => {
        try {
            setError("");

            if (!customerId) {
                setError(
                    "Please select a customer"
                );
                return;
            }

            if (items.length === 0) {
                setError(
                    "Add at least one product"
                );
                return;
            }

            setSaving(true);

            const response =
                await createChallan({
                    customerId:
                        Number(customerId),

                    items: items.map(
                        (item) => ({
                            productId:
                                item.productId,
                            quantity:
                                item.quantity
                        })
                    )
                });

            navigate(
                `/challans/${response.challan.id}`
            );
        } catch (error) {
            const message =
                axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : undefined;

            setError(
                message ||
                    "Failed to create challan"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border bg-white p-10 text-center">
                Loading...
            </div>
        );
    }

    return (
        <div className="space-y-6">

            <div>
                <h1 className="text-2xl font-bold">
                    Create Challan
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Create a new sales challan.
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <div className="rounded-xl border bg-white p-6">

                <label className="mb-2 block text-sm font-medium">
                    Customer
                </label>

                <select
                    value={customerId}
                    onChange={(e) =>
                        setCustomerId(
                            e.target.value
                        )
                    }
                    className="w-full rounded-lg border px-3 py-2"
                >
                    <option value="">
                        Select customer
                    </option>

                    {customers.map(
                        (customer) => (
                            <option
                                key={customer.id}
                                value={customer.id}
                            >
                                {customer.businessName
                                    ? `${customer.businessName} - ${customer.name}`
                                    : customer.name}
                            </option>
                        )
                    )}
                </select>

            </div>

            <div className="rounded-xl border bg-white p-6">

                <h2 className="mb-4 font-semibold">
                    Add Products
                </h2>

                <div className="grid gap-4 md:grid-cols-[1fr_150px_auto]">

                    <select
                        value={productId}
                        onChange={(e) =>
                            setProductId(
                                e.target.value
                            )
                        }
                        className="rounded-lg border px-3 py-2"
                    >
                        <option value="">
                            Select product
                        </option>

                        {products.map(
                            (product) => (
                                <option
                                    key={product.id}
                                    value={product.id}
                                >
                                    {product.name}
                                    {" — Stock: "}
                                    {
                                        product.currentStock
                                    }
                                </option>
                            )
                        )}
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) =>
                            setQuantity(
                                Number(
                                    e.target.value
                                )
                            )
                        }
                        className="rounded-lg border px-3 py-2"
                    />

                    <button
                        type="button"
                        onClick={addItem}
                        className="rounded-lg bg-black px-5 py-2 text-white"
                    >
                        Add
                    </button>

                </div>

            </div>

            <div className="overflow-hidden rounded-xl border bg-white">

                <div className="border-b px-5 py-4">
                    <h2 className="font-semibold">
                        Challan Items
                    </h2>
                </div>

                {items.length === 0 ? (
                    <p className="p-8 text-center text-sm text-gray-500">
                        No products added yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b bg-gray-50">
                                <tr>
                                    <th className="px-5 py-3 text-sm">
                                        Product
                                    </th>

                                    <th className="px-5 py-3 text-sm">
                                        SKU
                                    </th>

                                    <th className="px-5 py-3 text-sm">
                                        Quantity
                                    </th>

                                    <th className="px-5 py-3 text-sm">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            <tbody className="divide-y">
                                {items.map(
                                    (item) => (
                                        <tr
                                            key={
                                                item.productId
                                            }
                                        >
                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    item.productName
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    item.sku
                                                }
                                            </td>

                                            <td className="px-5 py-4 text-sm">
                                                {
                                                    item.quantity
                                                }
                                            </td>

                                            <td className="px-5 py-4">
                                                <button
                                                    onClick={() =>
                                                        removeItem(
                                                            item.productId
                                                        )
                                                    }
                                                    className="text-sm text-red-600"
                                                >
                                                    Remove
                                                </button>
                                            </td>
                                        </tr>
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                <div className="flex justify-end border-t p-5">
                    <button
                        onClick={
                            handleSubmit
                        }
                        disabled={
                            saving ||
                            items.length === 0
                        }
                        className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Creating..."
                            : "Save Draft"}
                    </button>
                </div>

            </div>

        </div>
    );
};

export default CreateChallan;