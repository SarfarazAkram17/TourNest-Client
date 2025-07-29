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
import { useQueryClient } from "@tanstack/react-query";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tokenLoading, setTokenLoading] = useState(true);
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

  const forgotPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  const logOutUser = () => {
    setLoading(true);
    localStorage.removeItem("token");
    setToken(null);
    queryClient.clear();
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      const tokenString = localStorage.getItem("token");
      if (tokenString) {
        setTokenLoading(true);
        const parsedToken = JSON.parse(tokenString);
        const now = Date.now();
        const twentyFourHours = 24 * 60 * 60 * 1000;

        if (now - parsedToken.timestamp > twentyFourHours) {
          localStorage.removeItem("token");
          setToken(null);
          setLoading(false);
        } else {
          setToken(parsedToken.value);
          setTokenLoading(false);
        }
      } else {
        setToken(null);
        setTokenLoading(false);
      }
    });
    return () => {
      unsubscribe();
    };
  }, []);

  const authInfo = {
    user,
    uid,
    userEmail,
    loading,
    token,
    tokenLoading,
    setTokenLoading,
    setToken,
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
