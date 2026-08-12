interface StatCardProps {
    label: string;
    value: number;
    description?: string;
}

const StatCard = ({
    label,
    value,
    description
}: StatCardProps) => {
    return (
        <div className="rounded-xl border bg-white p-5">
            <p className="text-sm font-medium text-gray-500">
                {label}
            </p>

            <p className="mt-2 text-3xl font-bold text-gray-900">
                {value}
            </p>

            {description && (
                <p className="mt-1 text-xs text-gray-500">
                    {description}
                </p>
            )}
        </div>
    );
};

export default StatCard;