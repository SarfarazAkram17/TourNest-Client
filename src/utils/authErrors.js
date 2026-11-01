const MESSAGES = {
  "auth/invalid-credential": "Incorrect email or password.",
  "auth/wrong-password": "Incorrect email or password.",
  "auth/user-not-found": "No account found with that email.",
  "auth/email-already-in-use": "An account with this email already exists. Try logging in instead.",
  "auth/weak-password": "Choose a stronger password (at least 6 characters).",
  "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
  "auth/network-request-failed": "Network error. Check your connection and try again.",
  "auth/invalid-email": "That email address doesn't look right.",
};

export const getAuthErrorMessage = (error) =>
  MESSAGES[error?.code] || error?.response?.data?.message || error?.message || "Something went wrong.";
