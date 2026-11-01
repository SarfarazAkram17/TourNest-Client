import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LuEye, LuEyeOff } from "react-icons/lu";
import useAuth from "../../Hooks/useAuth";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import SocialLogin from "../../Components/Common/SocialLogin";
import FormField from "../../Components/UI/FormField";
import { getAuthErrorMessage } from "../../utils/authErrors";
import AuthShell from "./AuthShell";

const Login = () => {
  useDocumentTitle("Log in");
  const { loginUser, forgotPassword, startSession } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = typeof location.state === "string" ? location.state : "/dashboard";

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const handleLogin = async ({ email, password }) => {
    setLoading(true);
    try {
      const cred = await loginUser(email.trim(), password);
      await startSession(cred.user);
      toast.success("Welcome back!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    const email = getValues("email")?.trim();
    if (!email) {
      toast.warn("Enter your email above first, then press “Forgot password”.");
      return;
    }
    try {
      await forgotPassword(email);
      toast.success("Password reset email sent. Check your spam folder too.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to manage your trips, bookings and stories."
      footer={
        <>
          New to TourNest?{" "}
          <Link
            to="/register"
            state={location.state}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleLogin)} className="space-y-5" noValidate>
        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <input
            id="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            aria-invalid={!!errors.email}
            className="input w-full"
            {...register("email", {
              required: "Enter your email address.",
              pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email address." },
            })}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <label className="input w-full items-center gap-2" aria-invalid={!!errors.password}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="current-password"
              placeholder="Your password"
              className="min-w-0 grow"
              {...register("password", { required: "Enter your password." })}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="text-muted hover:text-base-content"
            >
              {showPassword ? <LuEyeOff size={18} /> : <LuEye size={18} />}
            </button>
          </label>
          <button
            type="button"
            onClick={handleForgotPassword}
            className="self-start text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Forgot password?
          </button>
        </FormField>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Log in"}
        </button>
      </form>

      <div className="divider my-6 text-xs text-muted">or</div>
      <SocialLogin state={location.state} message="Signed in with Google." />
    </AuthShell>
  );
};

export default Login;
