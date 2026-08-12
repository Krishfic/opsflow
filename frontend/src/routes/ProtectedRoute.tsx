import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute = ({
    children
}: ProtectedRouteProps) => {
    const {
        user,
        loading
    } = useAuth();

    if (loading) {
        return <LoadingScreen />;
    }

    if (!user) {
        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    return <>{children}</>;
};

export default ProtectedRoute;