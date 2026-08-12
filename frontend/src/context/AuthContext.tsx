import {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import {
    getCurrentUser,
    loginUser,
    logoutUser
} from "../api/auth.api";

import type {
    LoginData
} from "../api/auth.api";

import type { User } from "../types/auth";

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (data: LoginData) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext =
    createContext<AuthContextType | undefined>(
        undefined
    );

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] =
        useState<User | null>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {
        const loadUser = async () => {
            try {
                const response =
                    await getCurrentUser();

                setUser(response.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    const login = async (
        data: LoginData
    ) => {
        const response =
            await loginUser(data);

        setUser(response.user);
    };

    const logout = async () => {
        await logoutUser();
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth must be used inside AuthProvider"
        );
    }

    return context;
};