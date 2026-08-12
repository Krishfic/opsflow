interface StockMovement {
    id: number;
    quantity: number;
    type: "IN" | "OUT";
    reason: string;
    createdAt: string;

    product: {
        id: number;
        name: string;
        sku: string;
    };

    createdBy: {
        id: number;
        name: string;
        role: string;
    };
}

interface RecentStockMovementsProps {
    movements: StockMovement[];
}

const RecentStockMovements = ({
    movements
}: RecentStockMovementsProps) => {
    return (
        <div className="rounded-xl border bg-white">
            <div className="border-b px-5 py-4">
                <h2 className="font-semibold text-gray-900">
                    Recent Stock Movements
                </h2>

                <p className="mt-1 text-xs text-gray-500">
                    Latest inventory activity
                </p>
            </div>

            <div className="divide-y">
                {movements.length === 0 ? (
                    <p className="px-5 py-8 text-center text-sm text-gray-500">
                        No stock movements found.
                    </p>
                ) : (
                    movements.map((movement) => (
                        <div
                            key={movement.id}
                            className="flex items-center justify-between px-5 py-4"
                        >
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {movement.product.name}
                                </p>

                                <p className="mt-1 text-xs text-gray-500">
                                    {movement.product.sku}
                                    {" · "}
                                    {movement.reason}
                                </p>
                            </div>

                            <div className="text-right">
                                <span
                                    className={`text-sm font-semibold ${
                                        movement.type === "IN"
                                            ? "text-green-600"
                                            : "text-red-600"
                                    }`}
                                >
                                    {movement.type === "IN"
                                        ? "+"
                                        : "-"}
                                    {movement.quantity}
                                </span>

                                <p className="mt-1 text-xs text-gray-500">
                                    {movement.createdBy.name}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default RecentStockMovements;