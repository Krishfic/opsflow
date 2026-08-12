import { useEffect, useState } from "react";
import {
    Link,
    useNavigate,
    useParams
} from "react-router-dom";
import axios from "axios";

import {
    getProductById,
    updateProduct
} from "../../api/product.api";

const EditProduct = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [error, setError] =
        useState("");

    const [form, setForm] = useState({
        name: "",
        sku: "",
        category: "",
        unitPrice: "",
        minimumStock: "",
        location: ""
    });

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const response =
                    await getProductById(
                        Number(id)
                    );

                const product =
                    response.product;

                setForm({
                    name: product.name,
                    sku: product.sku,
                    category: product.category,
                    unitPrice:
                        String(product.unitPrice),
                    minimumStock:
                        String(product.minimumStock),
                    location: product.location
                });
            } catch (error) {
                console.error(error);

                setError(
                    axios.isAxiosError(error)
                        ? error.response?.data?.message ||
                              "Failed to load product"
                        : "Failed to load product"
                );
            } finally {
                setLoading(false);
            }
        };

        loadProduct();
    }, [id]);

    const handleChange = (
        event: React.ChangeEvent<
            HTMLInputElement
        >
    ) => {
        setForm({
            ...form,
            [event.target.name]:
                event.target.value
        });
    };

    const handleSubmit = async (
        event: React.FormEvent
    ) => {
        event.preventDefault();

        try {
            setSaving(true);
            setError("");

            await updateProduct(
                Number(id),
                {
                    name: form.name,
                    sku: form.sku,
                    category: form.category,
                    unitPrice:
                        Number(form.unitPrice),
                    minimumStock:
                        Number(
                            form.minimumStock
                        ),
                    location: form.location
                }
            );

            navigate(
                `/products/${id}`,
                {
                    replace: true
                }
            );
        } catch (error) {
            console.error(error);

            const message =
                axios.isAxiosError(error)
                    ? error.response?.data?.message
                    : undefined;

            setError(
                message ||
                    "Failed to update product"
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="rounded-xl border bg-white p-10 text-center">
                Loading product...
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-2xl space-y-6">

            <div>
                <Link
                    to={`/products/${id}`}
                    className="text-sm text-gray-500 hover:underline"
                >
                    ← Back to Product
                </Link>

                <h1 className="mt-3 text-2xl font-bold">
                    Edit Product
                </h1>

                <p className="mt-1 text-sm text-gray-500">
                    Update product information.
                </p>
            </div>

            {error && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-5 rounded-xl border bg-white p-6"
            >

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Product Name
                    </label>

                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        SKU
                    </label>

                    <input
                        name="sku"
                        value={form.sku}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Category
                    </label>

                    <input
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Unit Price
                        </label>

                        <input
                            type="number"
                            step="0.01"
                            min="0"
                            name="unitPrice"
                            value={
                                form.unitPrice
                            }
                            onChange={
                                handleChange
                            }
                            required
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                    <div>
                        <label className="mb-1 block text-sm font-medium">
                            Minimum Stock
                        </label>

                        <input
                            type="number"
                            min="0"
                            name="minimumStock"
                            value={
                                form.minimumStock
                            }
                            onChange={
                                handleChange
                            }
                            required
                            className="w-full rounded-lg border px-3 py-2"
                        />
                    </div>

                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium">
                        Location
                    </label>

                    <input
                        name="location"
                        value={
                            form.location
                        }
                        onChange={
                            handleChange
                        }
                        required
                        className="w-full rounded-lg border px-3 py-2"
                    />
                </div>

                <div className="flex justify-end gap-3 border-t pt-5">

                    <Link
                        to={`/products/${id}`}
                        className="rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </Link>

                    <button
                        type="submit"
                        disabled={saving}
                        className="rounded-lg bg-black px-5 py-2 text-sm font-medium text-white disabled:opacity-50"
                    >
                        {saving
                            ? "Saving..."
                            : "Save Changes"}
                    </button>

                </div>

            </form>

        </div>
    );
};

export default EditProduct;