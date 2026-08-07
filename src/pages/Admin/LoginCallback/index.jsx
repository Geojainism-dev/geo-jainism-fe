import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminLoginCallback() {
  const { status } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (status === "authenticated") {
      navigate("/admin/dashboard", { replace: true });
    } else if (status === "pending") {
      navigate("/admin/pending", { replace: true });
    } else if (status === "unauthenticated") {
      toast.error("Login failed. Please try again.");
      navigate("/admin/login", { replace: true });
    }
  }, [status, navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <p className="text-sm text-muted-foreground">Signing you in...</p>
    </div>
  );
}
