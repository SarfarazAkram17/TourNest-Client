import { useCallback, useEffect, useMemo, useState } from "react";
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
import { axiosPublic } from "../../Hooks/useAxios";
import { setAccessToken } from "../../Hooks/tokenStore";

const googleProvider = new GoogleAuthProvider();
googleProvider.addScope("email");

const TOKEN_KEY = "token";
const TOKEN_TTL = 24 * 60 * 60 * 1000;

const readStoredToken = () => {
  try {
    const raw = localStorage.getItem(TOKEN_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.timestamp > TOKEN_TTL) {
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
    return parsed.value;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileVersion, setProfileVersion] = useState(0);
  const [token, setTokenState] = useState(() => {
    const stored = readStoredToken();
    setAccessToken(stored);
    return stored;
  });

  const userEmail = user?.email || user?.providerData?.[0]?.email || "";
  const uid = user?.uid || "";

  const setToken = useCallback((value) => {
    setAccessToken(value);
    setTokenState(value);
  }, []);

  const createUser = (email, password) =>
    createUserWithEmailAndPassword(auth, email, password);

  const loginUser = (email, password) =>
    signInWithEmailAndPassword(auth, email, password);

  const updateUserProfile = async (profileInfo) => {
    await updateProfile(auth.currentUser, profileInfo);
    // Firebase mutates the same user object, so bump a counter to re-render consumers.
    setProfileVersion((v) => v + 1);
  };

  const continueWithGoogle = () => signInWithPopup(auth, googleProvider);

  const forgotPassword = (email) => sendPasswordResetEmail(auth, email);

  const logOutUser = useCallback(async () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    queryClient.clear();
    return signOut(auth);
  }, [queryClient, setToken]);

  /**
   * Completes sign-in on the TourNest API: upserts the user record, then
   * exchanges the Firebase identity for a TourNest JWT.
   */
  const startSession = useCallback(
    async (firebaseUser, extra = {}) => {
      const email =
        firebaseUser.email || firebaseUser.providerData?.[0]?.email || "";
      const idToken = await firebaseUser.getIdToken();
      const headers = { Authorization: `Bearer ${idToken}` };

      await axiosPublic.post(
        "/users",
        {
          email,
          name: firebaseUser.displayName || extra.name || "",
          photo: firebaseUser.photoURL || extra.photo || "",
        },
        { headers }
      );

      const { data } = await axiosPublic.post("/jwt", { email }, { headers });
      if (!data?.token) throw new Error("Could not start a secure session.");

      localStorage.setItem(
        TOKEN_KEY,
        JSON.stringify({ value: data.token, timestamp: Date.now() })
      );
      setToken(data.token);
      queryClient.invalidateQueries({ queryKey: ["userRole"] });
      return data.token;
    },
    [queryClient, setToken]
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = useMemo(
    () => ({
      user,
      uid,
      userEmail,
      loading,
      token,
      // kept for backwards compatibility with older components
      tokenLoading: false,
      setToken,
      createUser,
      loginUser,
      updateUserProfile,
      continueWithGoogle,
      forgotPassword,
      logOutUser,
      startSession,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [user, profileVersion, uid, userEmail, loading, token, logOutUser, startSession, setToken]
  );

  return <AuthContext value={authInfo}>{children}</AuthContext>;
};

export default AuthProvider;
