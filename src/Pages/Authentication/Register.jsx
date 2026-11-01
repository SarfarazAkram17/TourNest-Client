import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { LuCamera, LuEye, LuEyeOff } from "react-icons/lu";
import useAuth from "../../Hooks/useAuth";
import useDocumentTitle from "../../Hooks/useDocumentTitle";
import SocialLogin from "../../Components/Common/SocialLogin";
import FormField from "../../Components/UI/FormField";
import { uploadImage } from "../../utils/cloudinary";
import { getAuthErrorMessage } from "../../utils/authErrors";
import AuthShell from "./AuthShell";

const Register = () => {
  useDocumentTitle("Create account");
  const { createUser, updateUserProfile, startSession } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = typeof location.state === "string" ? location.state : "/dashboard";

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [photoError, setPhotoError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choose an image file.");
      return;
    }
    setPhotoError("");
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleRegister = async ({ name, email, password }) => {
    if (!selectedFile) {
      setPhotoError("Add a profile photo so guides and travelers can recognise you.");
      return;
    }

    setLoading(true);
    try {
      const photoURL = await uploadImage(selectedFile);
      const cred = await createUser(email.trim(), password);
      await updateUserProfile({ displayName: name.trim(), photoURL });
      await startSession(cred.user, { name: name.trim(), photo: photoURL });
      toast.success("Account created. Welcome to TourNest!");
      navigate(redirectTo, { replace: true });
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Book trips, meet local guides and share your own stories."
      footer={
        <>
          Already have an account?{" "}
          <Link
            to="/login"
            state={location.state}
            className="font-semibold text-primary underline-offset-4 hover:underline"
          >
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit(handleRegister)} className="space-y-5" noValidate>
        <div className="flex items-center gap-4">
          <label
            htmlFor="profileImage"
            className="group relative cursor-pointer rounded-full focus-within:outline-2 focus-within:outline-primary"
          >
            {preview ? (
              <img src={preview} alt="Selected profile" className="h-20 w-20 rounded-full object-cover" />
            ) : (
              <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-dashed border-base-content/25 text-muted">
                <LuCamera size={26} aria-hidden="true" />
              </span>
            )}
            <input
              id="profileImage"
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={handleImageChange}
            />
          </label>
          <div className="min-w-0">
            <p className="text-sm font-semibold">Profile photo</p>
            <p className="text-xs text-muted">Tap the circle to upload. JPG or PNG, up to 10 MB.</p>
            {photoError && (
              <p role="alert" className="mt-1 text-xs font-medium text-error">
                {photoError}
              </p>
            )}
          </div>
        </div>

        <FormField label="Full name" htmlFor="name" error={errors.name?.message}>
          <input
            id="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            aria-invalid={!!errors.name}
            className="input w-full"
            {...register("name", {
              required: "Enter your name.",
              minLength: { value: 3, message: "Name must be at least 3 characters." },
            })}
          />
        </FormField>

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

        <FormField
          label="Password"
          htmlFor="password"
          hint="At least 6 characters with an uppercase letter, a lowercase letter and a number."
          error={errors.password?.message}
        >
          <label className="input w-full items-center gap-2" aria-invalid={!!errors.password}>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              placeholder="Create a password"
              className="min-w-0 grow"
              {...register("password", {
                required: "Create a password.",
                minLength: { value: 6, message: "Password must be at least 6 characters." },
                validate: {
                  upper: (v) => /[A-Z]/.test(v) || "Add at least one uppercase letter.",
                  lower: (v) => /[a-z]/.test(v) || "Add at least one lowercase letter.",
                  number: (v) => /\d/.test(v) || "Add at least one number.",
                },
              })}
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
        </FormField>

        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? <span className="loading loading-spinner loading-sm"></span> : "Create account"}
        </button>
      </form>

      <div className="divider my-6 text-xs text-muted">or</div>
      <SocialLogin state={location.state} message="Account ready. Welcome to TourNest!" />
    </AuthShell>
  );
};

export default Register;
