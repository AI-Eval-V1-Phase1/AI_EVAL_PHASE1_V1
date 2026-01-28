import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "./Components/Authentication/Login/Login";
import ForgotPassword from "./Components/Authentication/ForgotPassword/ForgotPassword";
import ResetPassword from "./Components/Authentication/ResetPassword/ResetPassword";
import MainLayout from "./Components/layout/MainLayout";
import Home from "./Components/pages/Home/Home";
import Dashboard from "./Components/pages/Dashboard/Dashboard";
import Assessments from "./Components/pages/Assessments/Assessments";
import VendorDirectory from "./Components/pages/VendorDirectory/VendorDirectory";
import Compilance from "./Components/pages/Compliance/Compilance";
import Goverance from "./Components/pages/Goverance/Goverance";
import { SalesEnablement } from "./Components/pages/SalesEnablement/SalesEnablement";
import EvidenceLibrary from "./Components/pages/EvidenceLibrary/EvidenceLibrary";
import UserManagement from "./Components/pages/UserManagement/UserManagement";
import { DirectoryListing } from "./Components/pages/DirectoryListing/DirectoryListing";
import Reports from "./Components/pages/Reports/Reports";
import MyVendors from "./Components/pages/MyVendors/MyVendors";
import Organizations from "./Components/pages/Organizations/Organizations";
import Toaster from "./Components/Toaster/Toaster";
import LayoutWithoutNav from "./Components/layout/LayoutWithoutNav";;
import VendorMainForm from "./Components/pages/VendorOnboarding/VendorMainForm";
import Onboarding from "./Components/pages/OnBoarding/Onboarding";
import BuyerMainForm from "./Components/pages/BuyerOnboarding/BuyerMainForm";

function App() {
  return (
    <>
    <Toaster/>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/organizations" element={<Organizations />} />
            <Route path="/assessments" element={<Assessments />} />
            <Route path="/vendor-directory" element={<VendorDirectory />} />
            <Route path="/my-vendor" element={<MyVendors />} />
            <Route path="/compilance" element={<Compilance />} />
            <Route path="/governance" element={<Goverance />} />
            <Route path="/sales-enablement" element={<SalesEnablement />} />
            <Route path="/evidence-library" element={<EvidenceLibrary />} />
            <Route path="/directory-listing" element={<DirectoryListing />} />
            <Route path="/reports" element={<Reports />} />

            <Route path="/user-management" element={<UserManagement />} />
          </Route>

{/* This Routing layout is for Vendor and Buyer onboarding without the side navigation bar  */}
          <Route element={<LayoutWithoutNav/>}>
          <Route path="/onBoarding" element={<Onboarding/>}/>
          <Route path="/onBoarding/vendorOnboarding" element={<VendorMainForm/>}/>
          <Route path="/onBoarding/buyerOnboarding" element={<BuyerMainForm/>}/>

          </Route>

        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
