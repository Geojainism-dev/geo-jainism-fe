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
import { registerFormSchema } from "@/features/auth/localAuthSchema";
import { registerLocalUser } from "@/features/auth/localAuthApi";
import { useAuth } from "@/features/auth/AuthContext";

const STRENGTH_COLORS = ["#E8909F", "#E8909F", "#EBDFC4", "#7DAF6E"];
const STRENGTH_LABELS = ["Weak", "Weak", "Fair", "Strong"];

const inputClass =
  "border-[#3C3228]/15 bg-[#FAF7F1] text-[#1F1D19] placeholder:text-[#3C3228]/35";
const labelClass = "mb-1.5 block text-xs font-medium text-[#3C3228]";

export default function AdminRegister() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [shake, setShake] = useState(false);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerFormSchema) });

  const password = watch("password") || "";
  const passwordRules = [
    { label: "8+ characters", met: password.length >= 8 },
    { label: "Contains a letter", met: /[a-zA-Z]/.test(password) },
    { label: "Contains a number", met: /[0-9]/.test(password) },
  ];
  const metCount = passwordRules.filter((r) => r.met).length;
  const strengthColor = STRENGTH_COLORS[metCount];

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 420);
  };

  const handleGoogleLogin = () => {
    window.location.href = `${import.meta.env.VITE_API_BASE_URL}/admin/auth/google`;
  };

  const onSubmit = async (values) => {
    const { confirmPassword, ...payload } = values;
    try {
      await registerLocalUser(payload);
      const user = await refresh();
      toast.success("Account created");
      navigate(user?.role === "USER" ? "/admin/pending" : "/admin/dashboard", { replace: true });
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      triggerShake();
    }
  };

  return (
    <AuthShell
      headline="Create Account"
      subhead="Join a community built on peace, knowledge, and gathering."
      orSuffix="sign up with"
      onGoogleClick={handleGoogleLogin}
      promptText="Already have an account?"
      promptLinkText="Sign in"
      promptTo="/admin/login"
      shake={shake}
    >
      <form onSubmit={handleSubmit(onSubmit, triggerShake)} noValidate className="space-y-3.5">
        <div className="flex gap-2.5">
          <div className="flex-1">
            <Label htmlFor="firstName" className={labelClass}>
              First name
            </Label>
            <Input id="firstName" placeholder="Ananya" className={inputClass} {...register("firstName")} />
            {errors.firstName && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.firstName.message}</p>}
          </div>
          <div className="flex-1">
            <Label htmlFor="lastName" className={labelClass}>
              Last name
            </Label>
            <Input id="lastName" placeholder="Shah" className={inputClass} {...register("lastName")} />
            {errors.lastName && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <Label htmlFor="email" className={labelClass}>
            Email
          </Label>
          <Input id="email" type="email" placeholder="Example@email.com" className={inputClass} {...register("email")} />
          {errors.email && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.email.message}</p>}
        </div>

        <div>
          <Label htmlFor="phoneNumber" className={labelClass}>
            Phone number
          </Label>
          <Input
            id="phoneNumber"
            placeholder="+919876543210"
            className={inputClass}
            {...register("phoneNumber")}
          />
          {errors.phoneNumber && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.phoneNumber.message}</p>}
        </div>

        <div>
          <Label htmlFor="dateOfBirth" className={labelClass}>
            Date of birth
          </Label>
          <Input id="dateOfBirth" type="date" className={inputClass} {...register("dateOfBirth")} />
          {errors.dateOfBirth && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.dateOfBirth.message}</p>}
        </div>

        <div>
          <Label htmlFor="password" className={labelClass}>
            Password
          </Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="At least 8 characters"
              className={`${inputClass} pr-10`}
              aria-describedby="geo-pw-rules"
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

          <div className="mt-2.5 flex items-center justify-between gap-2.5">
            <div className="h-[3px] flex-1 overflow-hidden rounded-full bg-[#3C3228]/10">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${(metCount / 3) * 100}%`, background: strengthColor }}
              />
            </div>
            <span className="whitespace-nowrap text-[11px] font-semibold" style={{ color: strengthColor }}>
              {STRENGTH_LABELS[metCount]}
            </span>
          </div>
          <div id="geo-pw-rules" className="mt-2 flex flex-wrap gap-3.5">
            {passwordRules.map((rule) => (
              <span
                key={rule.label}
                className="flex items-center gap-1.5 text-xs transition-colors"
                style={{ color: rule.met ? "#1F1D19" : "#8C7F6B" }}
              >
                <span
                  className="flex h-3.5 w-3.5 items-center justify-center rounded-full text-[9px] text-white"
                  style={{
                    background: rule.met ? strengthColor : "transparent",
                    border: rule.met ? "none" : "1px solid rgba(60,50,40,0.25)",
                  }}
                >
                  {rule.met ? "✓" : ""}
                </span>
                {rule.label}
              </span>
            ))}
          </div>
          {errors.password && <p className="mt-1.5 text-[11.5px] text-destructive">{errors.password.message}</p>}
        </div>

        <div>
          <Label htmlFor="confirmPassword" className={labelClass}>
            Confirm password
          </Label>
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Re-enter password"
            className={inputClass}
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p className="mt-1.5 text-[11.5px] text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="!mt-5 h-[44px] w-full bg-[#1F2A24] text-white hover:bg-[#1F2A24]/90"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </AuthShell>
  );
}
