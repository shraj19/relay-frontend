import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useEffect } from "react";
function ProtectedRoute({ children }) {
    const { isAuthenticated , loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/signIn" replace />;
    }

    return children;
}

export default ProtectedRoute