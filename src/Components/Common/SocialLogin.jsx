import { useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import useAuth from "../../Hooks/useAuth";

const SocialLogin = ({ state, message = "Signed in with Google." }) => {
  const { continueWithGoogle, startSession } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await continueWithGoogle();
      await startSession(res.user);
      toast.success(message);
      navigate(state || "/dashboard");
    } catch (error) {
      if (error?.code !== "auth/popup-closed-by-user") {
        toast.error(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleLogin}
      disabled={loading}
      className="btn btn-outline w-full"
    >
      {loading ? (
        <span className="loading loading-spinner loading-sm" aria-hidden="true"></span>
      ) : (
        <svg aria-hidden="true" width="20" height="20" viewBox="0 0 512 512">
          <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
          <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
          <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
          <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
        </svg>
      )}
      Continue with Google
    </button>
  );
};

export default SocialLogin;
