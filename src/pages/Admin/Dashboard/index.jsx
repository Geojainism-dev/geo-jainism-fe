import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminDashboard() {
  const { user } = useAuth();

  return (
    <div>
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Signed in as {user?.email} ({user?.role}).
      </p>
      <Link to="/admin/events" className="mt-4 inline-block text-sm underline">
        Manage events →
      </Link>
    </div>
  );
}
