import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import EmergencyAssistance from "@/components/pages/EmergencyAssistance";
import ClaimForm from "@/components/pages/ClaimForm";
import Claims from "@/components/pages/Claims";
import Policies from "@/components/pages/Policies";
import PolicyDetails from "@/components/pages/PolicyDetails";
import PolicyComparison from "@/components/pages/PolicyComparison";
import SafetyChecklists from "@/components/pages/SafetyChecklists";
import Dashboard from "@/components/pages/Dashboard";
import Recommendations from "@/components/pages/Recommendations";
import Documents from "@/components/pages/Documents";
import Profile from "@/components/pages/Profile";
import AddAsset from "@/components/pages/AddAsset";
import Payments from "@/components/pages/Payments";
import Layout from "@/components/organisms/Layout";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
<Routes>
<Route path="/" element={<Layout />}>
<Route index element={<Dashboard />} />
            <Route path="policies" element={<Policies />} />
            <Route path="policies/:id" element={<PolicyDetails />} />
            <Route path="policies/compare" element={<PolicyComparison />} />
            <Route path="claims" element={<Claims />} />
            <Route path="claims/new" element={<ClaimForm />} />
            <Route path="documents" element={<Documents />} />
            <Route path="profile" element={<Profile />} />
<Route path="add-asset" element={<AddAsset />} />
<Route path="safety" element={<SafetyChecklists />} />
<Route path="payments" element={<Payments />} />
            <Route path="recommendations" element={<Recommendations />} />
            <Route path="emergency" element={<EmergencyAssistance />} />
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