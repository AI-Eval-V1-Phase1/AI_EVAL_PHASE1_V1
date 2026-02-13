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
<<<<<<< HEAD
import Compilance from "./Components/pages/SecurityCenter/Compilance";
=======
import Compilance from "./Components/pages/Compliance/Compilance";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import Goverance from "./Components/pages/Goverance/Goverance";
import { SalesEnablement } from "./Components/pages/SalesEnablement/SalesEnablement";
import EvidenceLibrary from "./Components/pages/EvidenceLibrary/EvidenceLibrary";
import UserManagement from "./Components/pages/UserManagement/UserManagement";
import { DirectoryListing } from "./Components/pages/DirectoryListing/DirectoryListing";
import Reports from "./Components/pages/Reports/Reports";
import MyVendors from "./Components/pages/MyVendors/MyVendors";
import Organizations from "./Components/pages/Organizations/Organizations";
import Toaster from "./Components/Toaster/Toaster";
import LayoutWithoutNav from "./Components/layout/LayoutWithoutNav";
import VendorMainForm from "./Components/pages/VendorOnboarding/VendorMainForm";
import Onboarding from "./Components/pages/OnBoarding/Onboarding";
import BuyerMainForm from "./Components/pages/BuyerOnboarding/BuyerMainForm";
import SignUp from "./Components/Authentication/SignUp/SignUp";
import RouteAccess from "./utils/RouteAccess";
import PageNotFound from "./Components/PageNotFound/PageNotFound";
import Authorization from "./utils/Authorization";
import OnboardingAccess from "./utils/OnboardingVerify";
import VendorAttestationsMainForm from "./Components/pages/VendorAttestations/VendorAttestationsMainForm";
import VendorCOTSMain from "./Components/pages/Assessments/VendorCOTS/VendorCOTSMain";
import VendorAttestationDetails from "./Components/pages/VendorAttestationDetails/VendorAttestationDetails";
import BuyerAssessment from "./Components/pages/Assessments/BuyerAssessment/BuyerAssessment";
import VendorSelfAttestationLayout from "./Components/layout/VendorSelfAttestationLayout";

function App() {
  return (
    <>
      <Toaster />
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/forgotPassword" element={<ForgotPassword />} />
          <Route path="/resetPassword" element={<ResetPassword />} />
          <Route path="/signup/:token" element={<SignUp />} />
          <Route path="/vendorSelfAttestation" element={<VendorSelfAttestationLayout />}>
            <Route index element={<VendorAttestationsMainForm />} />
            <Route path=":token" element={<VendorAttestationsMainForm />} />
          </Route>
          <Route element={<Authorization />}>
            <Route element={<RouteAccess />}>
              <Route element={<MainLayout />}>
                <Route path="/" element={<Home />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/organizations" element={<Organizations />} />
                <Route path="/assessments" element={<Assessments />} />
                <Route path="/vendorcots/:assessmentId" element={<VendorCOTSMain />} />
                <Route path="/vendorcots" element={<VendorCOTSMain />} />
                <Route path="/buyerAssessment/:id" element={<BuyerAssessment />} />
                <Route path="/buyerAssessment" element={<BuyerAssessment />} />
                <Route path="/vendor-directory" element={<VendorDirectory />} />
                <Route path="/my-vendor" element={<MyVendors />} />
<<<<<<< HEAD
                <Route path="/security_center" element={<Compilance />} />
=======
                <Route path="/compilance" element={<Compilance />} />
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
                <Route path="/governance" element={<Goverance />} />
                <Route path="/sales-enablement" element={<SalesEnablement />} />
                <Route path="/evidence-library" element={<EvidenceLibrary />} />
                <Route
                  path="/product_profile"
                  element={<DirectoryListing />}
                />
                <Route path="/reports" element={<Reports />} />
                <Route
                  path="/attestation_details"
                  element={<VendorAttestationDetails />}
                />

                <Route path="/user-management" element={<UserManagement />} />
              </Route>
            </Route>
          </Route>

          {/* This Routing layout is for Vendor and Buyer onboarding without the side navigation bar  */}
          {/* <Route element={<OnboardingAccess />}> */}
          <Route element={<LayoutWithoutNav />}>
            <Route path="/onBoarding/:token" element={<Onboarding />} />
            <Route
              path="/onBoarding/vendorOnboarding/:token"
              element={<VendorMainForm type="vendor" />}
            />
            <Route
              path="/onBoarding/buyerOnboarding/:token"
              element={<BuyerMainForm type="buyer" />}
            />
            <Route path="/vendorcots" element={<VendorCOTSMain />} />
            <Route element={<Authorization />}>
              <Route element={<RouteAccess />}>
                <Route path="/buyerAssessment" element={<BuyerAssessment />} />
              </Route>
            </Route>
            <Route path="/buyerAssessment" element={<BuyerAssessment />} />
          </Route>
          {/* </Route> */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
