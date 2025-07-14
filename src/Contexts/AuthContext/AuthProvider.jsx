import { useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../../../firebase.config";
import useAxios from "../../Hooks/useAxios";
import { useQueryClient } from "@tanstack/react-query";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const axiosInstance = useAxios();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const userEmail = user?.email || user?.providerData?.[0]?.email || "";
  const uid = user?.uid || "";

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (profileInfo) => {
    return updateProfile(auth.currentUser, profileInfo);
  };

  const continueWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const forgotPassword = (email)=>{
   return sendPasswordResetEmail(auth, email)
  }

  const logOutUser = () => {
    setLoading(true);
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear();
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser?.email || user?.providerData?.[0]?.email) {
        try {
          const res = await axiosInstance.post("/jwt", {
            email: currentUser.email || currentUser.providerData[0].email,
          });

          if (res.data.token) {
            localStorage.setItem("token", res.data.token);
            setToken(res.data.token);
          }
        } catch (err) {
          localStorage.removeItem("token");
          setToken(null);
        }
      } else {
        localStorage.removeItem("token");
        setToken(null);
      }
    });

    return () => unsubscribe();
  }, [axiosInstance, user?.providerData]);

  const authInfo = {
    user,
    uid,
    userEmail,
    loading,
    token,
    createUser,
    loginUser,
    updateUserProfile,
    continueWithGoogle,
    forgotPassword,
    logOutUser,
  };

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
