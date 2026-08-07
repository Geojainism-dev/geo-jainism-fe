import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import AuthShell from "@/features/auth/AuthShell";
import { loginFormSchema } from "@/features/auth/localAuthSchema";
import { loginLocalUser } from "@/features/auth/localAuthApi";
import { useAuth } from "@/features/auth/AuthContext";

export default function AdminLogin() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginFormSchema) });

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  };

  const handleGoogleLogin = () => {
    // Must be a real browser navigation, not a fetch call — Google's OAuth
    // consent flow requires a top-level redirect.
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/admin/auth/google`;
  };

  const onSubmit = async (values) => {
    try {
      await loginLocalUser(values);
      const user = await refresh();
      navigate(user?.role === "USER" ? "/admin/pending" : "/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      triggerShake();
    }
  };

  return (
    <AuthShell
      headline="Welcome Back"
      subhead="Today is a new day. It's your day. You shape it. Sign in to start managing your journey."
      orSuffix="sign in with"
      onGoogleClick={handleGoogleLogin}
      promptText="Don't have an account?"
      promptLinkText="Sign up"
      promptTo="/admin/register"
      shake={shake}
    >
      <form onSubmit={handleSubmit(onSubmit, triggerShake)} noValidate className="space-y-3.5">
        <div>
          <Label htmlFor="email" className="mb-1.5 block text-xs font-medium text-[#3C3228]">
            Email
          </Label>
          <Input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="Example@email.com"
            className="border-[#3C3228]/15 bg-[#FAF7F1] text-[#1F1D19] placeholder:text-[#3C3228]/35"
            {...register("email")}
          />
          {errors.email && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className="mb-1.5 block text-xs font-medium text-[#3C3228]">
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="At least 8 characters"
              className="border-[#3C3228]/15 bg-[#FAF7F1] pr-10 text-[#1F1D19] placeholder:text-[#3C3228]/35"
              {...register("password")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#3C3228]/50 transition-colors hover:text-[#3C3228]"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.password.message}</p>}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="!mt-5 h-[44px] w-full bg-[#1F2A24] text-white hover:bg-[#1F2A24]/90"
        >
          {isSubmitting ? "Signing in..." : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}
