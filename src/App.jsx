import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Layout from "@/components/organisms/Layout";
import Dashboard from "@/components/pages/Dashboard";
import Policies from "@/components/pages/Policies";
import PolicyComparison from "@/components/pages/PolicyComparison";
import Claims from "@/components/pages/Claims";
import ClaimForm from "@/components/pages/ClaimForm";
import Documents from "@/components/pages/Documents";
import Profile from "@/components/pages/Profile";
import AddAsset from "@/components/pages/AddAsset";
import SafetyChecklists from "@/components/pages/SafetyChecklists";
import Payments from "@/components/pages/Payments";
function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
<Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="policies" element={<Policies />} />
            <Route path="policies/compare" element={<PolicyComparison />} />
            <Route path="claims" element={<Claims />} />
            <Route path="claims/new" element={<ClaimForm />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<Profile />} />
<Route path="add-asset" element={<AddAsset />} />
<Route path="safety" element={<SafetyChecklists />} />
            <Route path="payments" element={<Payments />} />
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