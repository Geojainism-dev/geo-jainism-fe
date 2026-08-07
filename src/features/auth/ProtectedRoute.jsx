import { Navigate } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

// requiredRole gates a route to a specific role — SUPER_ADMIN always passes
// regardless (mirroring the backend's authorize.js bypass), matching the
// USER < ADMIN < SUPER_ADMIN hierarchy.
export default function ProtectedRoute({ children, requiredRole }) {
  const { status, user } = useAuth();

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/admin/login" replace />;
  }

  if (status === "pending") {
    return <Navigate to="/admin/pending" replace />;
  }

  if (requiredRole && user?.role !== requiredRole && user?.role !== "SUPER_ADMIN") {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}
