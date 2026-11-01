import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import "./index.css";
import router from "./Router/Router.jsx";
import AuthProvider from "./Contexts/AuthContext/AuthProvider.jsx";
import ThemeProvider from "./Contexts/ThemeContext/ThemeProvider.jsx";
import useTheme from "./Hooks/useTheme";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000,
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Toasts follow the active theme.
const ThemedToasts = () => {
  const { theme } = useTheme();
  return <ToastContainer theme={theme} position="top-right" newestOnTop closeOnClick pauseOnFocusLoss={false} />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <ThemedToasts />
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </StrictMode>
);
