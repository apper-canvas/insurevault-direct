import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Policies from "@/components/pages/Policies";
import Claims from "@/components/pages/Claims";
import Documents from "@/components/pages/Documents";
import Profile from "@/components/pages/Profile";
import AddAsset from "@/components/pages/AddAsset";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="policies" element={<Policies />} />
            <Route path="claims" element={<Claims />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<Profile />} />
            <Route path="add-asset" element={<AddAsset />} />
          </Route>
        </Routes>
        
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          className="z-50"
        />
      </div>
    </BrowserRouter>
  );
}

export default App;