import { useAuth } from "../../context/AuthContext";

const Header = () => {
    const {
        user,
        logout
    } = useAuth();

    if (!user) {
        return null;
    }

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error(
                "Logout failed:",
                error
            );
        }
    };

    return (
        <header className="flex h-16 items-center justify-between border-b bg-white px-6">
            <div>
                <h2 className="text-lg font-semibold">
                    Operations
                </h2>
            </div>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-medium">
                        {user.name}
                    </p>

                    <p className="text-xs text-gray-500">
                        {user.role}
                    </p>
                </div>

                <button
                    onClick={handleLogout}
                    className="rounded-lg border px-3 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    Logout
                </button>
            </div>
        </header>
    );
};

export default Header;