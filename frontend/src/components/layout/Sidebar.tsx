import { NavLink } from "react-router-dom";

import { useAppSelector } from "../../app/hooks";

import type {
    UserRole
} from "../../features/auth/authSlice";

interface NavigationItem {
    label: string;
    path: string;
    roles: UserRole[];
}

const navigationItems: NavigationItem[] = [
    {
        label: "Dashboard",
        path: "/dashboard",
        roles: [
            "ADMIN",
            "SALES",
            "WAREHOUSE",
            "ACCOUNTS"
        ]
    },
    {
        label: "Customers",
        path: "/customers",
        roles: [
            "ADMIN",
            "SALES",
            "ACCOUNTS"
        ]
    },
    {
        label: "Products",
        path: "/products",
        roles: [
            "ADMIN",
            "SALES",
            "WAREHOUSE"
        ]
    },
    {
        label: "Inventory",
        path: "/inventory",
        roles: [
            "ADMIN",
            "WAREHOUSE"
        ]
    },
    {
        label: "Challans",
        path: "/challans",
        roles: [
            "ADMIN",
            "SALES",
            "ACCOUNTS"
        ]
    }
];

const Sidebar = () => {
    const user = useAppSelector(
        (state) => state.auth.user
    );

    if (!user) {
        return null;
    }

    const visibleItems =
        navigationItems.filter((item) =>
            item.roles.includes(user.role)
        );

    return (
        <aside className="hidden w-64 shrink-0 border-r bg-white md:flex md:flex-col">
            <div className="flex h-16 items-center border-b px-6">
                <h1 className="text-xl font-bold">
                    OpsFlow
                </h1>
            </div>

            <nav className="flex-1 space-y-1 p-4">
                {visibleItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `block rounded-lg px-4 py-2.5 text-sm font-medium transition ${
                                isActive
                                    ? "bg-black text-white"
                                    : "text-gray-600 hover:bg-gray-100"
                            }`
                        }
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>
        </aside>
    );
};

export default Sidebar;