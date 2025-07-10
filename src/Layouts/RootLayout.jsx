import React from "react";
import { Outlet } from "react-router";
import Navbar from "../Components/Common/Navbar";
import Footer from "../Components/Common/Footer";

const RootLayout = () => {
  return (
    <div className="xl:container mx-auto">
      <Navbar></Navbar>
      <Outlet></Outlet>
      <Footer></Footer>
    </div>
  );
};

export default RootLayout;
