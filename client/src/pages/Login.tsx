import { useState } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Sparkles, TrendingUp, Users, ShieldCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { extractError } from "@/api/axios";

const schema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password required"),
});

type FormValues = z.infer<typeof schema>;

const features = [
  { icon: TrendingUp, text: "Track your full lead pipeline" },
  { icon: Users, text: "Role-based team collaboration" },
  { icon: ShieldCheck, text: "Secure JWT authentication" },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((s) => s.setAuth);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    try {
      const result = await authApi.login(values.email, values.password);
      setAuth(result.token, result.user);
      toast.success(`Welcome back, ${result.user.name}!`);
      const redirectTo =
        (location.state as { from?: { pathname: string } } | null)?.from
          ?.pathname ?? "/";
      navigate(redirectTo, { replace: true });
    } catch (err) {
      toast.error(extractError(err, "Login failed"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50 dark:bg-slate-950">
      {/* Left brand panel — hidden on mobile */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-brand-600 to-brand-700 text-white flex-col justify-between p-12">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-white/20 grid place-items-center">
            <Sparkles size={20} />
          </div>
          <span className="text-xl font-bold">GigFlow</span>
        </div>
        <div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Smart Leads,<br />Smarter Results.
          </h2>
          <p className="text-brand-100 mb-8 text-lg">
            Manage your entire lead pipeline from one clean, fast dashboard.
          </p>
          <ul className="space-y-4">
            {features.map(({ icon: Icon, text }) => (
              <li key={text} className="flex items-center gap-3 text-brand-100">
                <div className="h-8 w-8 rounded-lg bg-white/10 grid place-items-center shrink-0">
                  <Icon size={16} />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="text-brand-200 text-sm">© 2025 GigFlow</p>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="h-10 w-10 rounded-lg bg-brand-600 grid place-items-center text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <p className="font-bold text-slate-900 dark:text-slate-100">GigFlow</p>
              <p className="text-xs text-slate-500">Smart Leads Dashboard</p>
            </div>
          </div>

          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-1">
            Welcome back
          </h1>
          <p className="text-sm text-slate-500 mb-8">
            Sign in to your GigFlow account
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              {...register("email")}
              error={errors.email?.message}
            />
            <Input
              label="Password"
              type="password"
              autoComplete="current-password"
              placeholder="••••••••"
              {...register("password")}
              error={errors.password?.message}
            />
            <Button type="submit" loading={loading} className="w-full" size="lg">
              Sign in
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            No account?{" "}
            <Link
              to="/register"
              className="text-brand-600 hover:underline font-medium"
            >
              Create one for free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}