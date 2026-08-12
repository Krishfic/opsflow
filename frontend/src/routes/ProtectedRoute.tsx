import { Navigate } from "react-router-dom";

import {
    useAppSelector
} from "../app/hooks";

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
    } = useAppSelector(
        (state) => state.auth
    );

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