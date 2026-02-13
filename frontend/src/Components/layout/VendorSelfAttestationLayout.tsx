import MainLayout from "./MainLayout";
import LayoutWithoutNav from "./LayoutWithoutNav";

/**
 * Renders Vendor Self Attestation with side + top nav when the user has a session
 * (e.g. after vendor onboarding auto-login), otherwise without nav.
 */
function VendorSelfAttestationLayout() {
  const hasSession = !!sessionStorage.getItem("bearerToken");

  if (hasSession) return <MainLayout />;
  return <LayoutWithoutNav />;
}

export default VendorSelfAttestationLayout;
