import { Outlet, ScrollRestoration } from "react-router";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/Footer";

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only z-[100] rounded-lg bg-primary px-4 py-2 font-semibold text-primary-content focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  );
};

export default RootLayout;
