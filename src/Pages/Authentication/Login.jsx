import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import useAxios from "../../Hooks/useAxios";
import useAuth from "../../Hooks/useAuth";
import SocialLogin from "../../Common/SocialLogin";

const Login = () => {
  const axiosInstance = useAxios();
  const [showPassword, setShowPassword] = useState(false);
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleLogin = (formData) => {
    setLoading(true);

    const email = formData.email.trim();
    const password = formData.password.trim();

    loginUser(email, password)
      .then(() => {
        toast.success("You logged in successfully");

        axiosInstance.post("/users", { email });

        navigate(location.state || "/");
        window.location.reload();
      })
      .catch((error) => {
        toast.error(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="px-4">
      <div className="card w-full shadow-xl max-w-md mx-auto my-12">
        <div className="card-body">
          <h1 className="text-3xl font-extrabold">Welcome Back</h1>
          <p className="mb-4 text-sm font-semibold">Login with TourNest</p>
          <form onSubmit={handleSubmit(handleLogin)} className="fieldset">
            <label className="label font-semibold">Email</label>
            <input
              type="email"
              {...register("email", { required: true })}
              className="input placeholder:text-[13px] placeholder:font-bold w-full"
              placeholder="Enter your email"
            />
            {errors.email?.type === "required" && (
              <p className="text-red-500 font-bold">Email is required.</p>
            )}

            <label className="label font-semibold mt-4">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="input placeholder:text-[13px] placeholder:font-bold w-full"
                {...register("password", {
                  required: true,
                })}
                placeholder="Enter your password"
              />
              {errors.password?.type === "required" && (
                <p className="text-red-500 font-bold">Password is required.</p>
              )}
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
            <div>
              <a className="link link-hover text-gray-600 font-semibold">
                Forgot password?
              </a>
            </div>
            <button
              disabled={loading}
              className="btn btn-primary text-black mt-6"
            >
              {" "}
              {loading ? (
                <span className="loading loading-spinner text-primary loading-md"></span>
              ) : (
                "Login"
              )}
            </button>
            <p className="text-xs my-2">
              Don't have any account ?{" "}
              <Link
                state={location.state}
                to="/register"
                className="hover:underline text-primary font-semibold"
              >
                Register
              </Link>
            </p>
          </form>
                  <div className="divider my-4">Or continue with</div>
          <SocialLogin
            state={location.state}
            message={"You registered successfully"}
          ></SocialLogin>
        </div>
      </div>
    </div>
  );
};

export default Login;
