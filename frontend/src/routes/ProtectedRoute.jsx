import { useSelector } from "react-redux";
import { selectUser, selectInitialized } from "../features/auth/auth.slice.js";
import { Navigate, Outlet } from "react-router-dom";
import Loader from "../shared/components/Loader.jsx";

export const ProtectedRoute = ({ allowedRoles }) => {
    const user = useSelector(selectUser);
    const initialized = useSelector(selectInitialized);

    if (!initialized) {
        return (
            <div className="h-screen w-screen flex justify-center items-center bg-slate-50 dark:bg-slate-950">
                <Loader message="Authenticating session..." />
            </div>
        );
    }

    if (!user) return <Navigate to="/login" replace />;

    if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

    return <Outlet />;
};