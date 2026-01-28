// src/components/Toaster.tsx
import React from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Toaster = () => {
  return (
    <ToastContainer
      position="top-right"      // where the toast appears
      autoClose={2000}          // auto close after 3s
      hideProgressBar={false}   // show/hide progress bar
      newestOnTop={true}
      closeOnClick
      rtl={false}
      theme="colored"
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  );
};

export default Toaster;
