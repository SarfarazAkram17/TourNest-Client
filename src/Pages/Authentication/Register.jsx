import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import userImage from "../../assets/image-upload-icon.png";
import axios from "axios";
import useAuth from "../../Hooks/useAuth";
import useAxios from "../../Hooks/useAxios";
import SocialLogin from "../../Common/SocialLogin";

const Register = () => {
  const axiosInstance = useAxios();
  const { createUser, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);
  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    clearErrors,
  } = useForm();

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
      clearErrors("photo");
    }
  };

  const handleRegister = (data) => {
    setLoading(true);

    const { name, email, password } = data;
    const imageData = new FormData();
    imageData.append("image", selectedFile);

    const imgbbKey = import.meta.env.VITE_imgbb_key;

    axios
      .post(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, imageData)
      .then((res) => {
        if (!res.data.success) {
          toast.error("Image upload failed");
          return;
        }

        const imageUrl = res.data.data.url;

        createUser(email, password)
          .then((res) => {
            console.log(res)
            const userProfile = {
              displayName: name.trim(),
              photoURL: imageUrl,
            };

            updateUserProfile(userProfile);

            const userInfo = {
              email,
              name: name.trim(),
              image: imageUrl,
              role: "tourist",
              createdAt: new Date().toISOString(),
            };

            axiosInstance.post("/users", userInfo);

            toast.success("Registered successfully");
            navigate(location.state || "/");
          })
          .catch((err) => toast.error(err.message))
          .finally(() => setLoading(false));
      })
      .catch((err) => {
        toast.error(err.message);
        setLoading(false);
      });
  };

  return (
    <div className="px-4">
      <div className="card w-full shadow-xl max-w-md mx-auto my-10">
        <div className="card-body">
          <h1 className="text-3xl font-extrabold">Create Your Account</h1>
          <p className="mb-4 text-sm font-semibold">Join TourNest today</p>

        <form onSubmit={handleSubmit(handleRegister)} className="fieldset">
            <label htmlFor="profileImage" className="cursor-pointer">
              <img
                src={preview || userImage}
                alt="Upload"
                className="w-13 h-13 object-cover rounded-full border-2 p-0.5 border-primary"
              />
            </label>
            <input
              type="file"
              id="profileImage"
              accept="image/*"
              {...register("photo", { required: true })}
              onChange={handleImageChange}
              className="hidden"
            />
            {errors.photo && (
              <p className="text-red-500 font-bold">
                Profile image is required.
              </p>
            )}

            <label className="label font-semibold mt-4">Name</label>
            <input
              type="text"
              {...register("name", { required: true, minLength: 6 })}
              className="input placeholder:text-[13px] placeholder:font-bold w-full"
              placeholder="Enter your name"
            />
            {errors.name && (
              <p className="text-red-500 font-bold">
                {errors.name.type === "required"
                  ? "Name is required."
                  : "Name must be at least 6 characters."}
              </p>
            )}

            <label className="label font-semibold mt-4">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input placeholder:text-[13px] placeholder:font-bold w-full"
              placeholder="Enter your email"
            />
            {errors.email && (
              <p className="text-red-500 font-bold">Email is required.</p>
            )}

            <label className="label font-semibold mt-4">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input placeholder:text-[13px] placeholder:font-bold w-full"
                placeholder="Enter your password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                  validate: {
                    hasUppercase: (value) =>
                      /[A-Z]/.test(value) ||
                      "Must include at least one uppercase letter",
                    hasLowercase: (value) =>
                      /[a-z]/.test(value) ||
                      "Must include at least one lowercase letter",
                    hasNumber: (value) =>
                      /\d/.test(value) || "Must include at least one number",
                  },
                })}
              />
              {showPassword ? (
                <FaEyeSlash
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 cursor-pointer z-10"
                  size={17}
                />
              ) : (
                <FaEye
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute top-3 right-3 cursor-pointer z-10"
                  size={17}
                />
              )}
            </div>
            {errors.password && (
              <div className="text-red-500 text-xs font-bold mt-1">
                {errors.password.message ||
                  (errors.password.type === "minLength"
                    ? "Password must be at least 6 characters."
                    : "Password is required.")}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary text-white mt-6"
            >
              {loading ? (
                <span className="loading loading-spinner text-primary loading-md"></span>
              ) : (
                "Register"
              )}
            </button>

            <p className="text-xs my-2">
              Already have an account?{" "}
              <Link
                state={location.state}
                to="/login"
                className="hover:underline text-primary font-semibold"
              >
                Login
              </Link>
            </p>
          </form>

          <div className="divider my-4">Or continue with</div>
          <SocialLogin message="Registration successful" state={location.state} />
        </div>
      </div>
    </div>
  );
};

export default Register;
