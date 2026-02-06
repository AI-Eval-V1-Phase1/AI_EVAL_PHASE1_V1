import { useEffect, useState, useMemo } from "react";
import "./vendor_onboarding.css";
import Button from "../../UI/Button";
import StepCompanyProfile from "./StepCompanyProfile";
import StepContactInformation from "./StepContactInformation";
import StepCompanyScale from "./StepCompanyScale";
import StepGeopgraphy from "./StepGeopgraphy";
import { ChevronLeftCircle, ChevronRightCircle, Send } from "lucide-react";
import StepVendorOnboardingPreview from "./StepVendorOnboardingPreview";
import { useNavigate } from "react-router-dom";
import CardOnBoarding from "../../UI/CardOnBoarding";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";
import CardConfirmation from "../../UI/CardConfirmation";
import type { VendorDataInterface } from "../../../types/formDataVendor";

/** Default empty form state for vendor onboarding */
const getDefaultVendorFormState = (
  type: string,
  vendor_Id: string | null,
  organization_Id: string | null,
): VendorDataInterface & {
  role?: string;
  vendorId?: string | null;
  organization_Id?: string;
} => ({
  role: type,
  vendorId: vendor_Id,
  organization_Id: organization_Id ?? undefined,
  vendorType: "",
  sector: {
    public_sector: [],
    private_sector: [],
    non_profit_sector: [],
  },
  vendorMaturity: "",
  companyWebsite: "",
  companyDescription: "",
  primaryContactName: "",
  primaryContactEmail: "",
  primaryContactRole: "",
  employeeCount: "",
  yearFounded: "" as unknown as number,
  headquartersLocation: "",
  operatingRegions: [],
});

/**
 * Normalize API vendor data into form state. Handles missing/empty fields and sector shape.
 */
function mapApiDataToFormState(
  apiData: Record<string, unknown>,
  defaults: ReturnType<typeof getDefaultVendorFormState>,
): VendorDataInterface & {
  role?: string;
  vendorId?: string | null;
  organization_Id?: string;
} {
  const sector = apiData.sector;
  let sectorNormalized = defaults.sector;
  if (sector && typeof sector === "object" && !Array.isArray(sector)) {
    const s = sector as Record<string, unknown>;
    sectorNormalized = {
      public_sector: Array.isArray(s.public_sector)
        ? (s.public_sector as string[])
        : [],
      private_sector: Array.isArray(s.private_sector)
        ? (s.private_sector as string[])
        : [],
      non_profit_sector: Array.isArray(s.non_profit_sector)
        ? (s.non_profit_sector as string[])
        : [],
    };
  }

  return {
    ...defaults,
    organization_Id:
      (apiData.organizationId as string) ?? defaults.organization_Id,
    vendorType: (apiData.vendorType as string) ?? "",
    sector: sectorNormalized,
    vendorMaturity: (apiData.vendorMaturity as string) ?? "",
    companyWebsite: (apiData.companyWebsite as string) ?? "",
    companyDescription: (apiData.companyDescription as string) ?? "",
    primaryContactName: (apiData.primaryContactName as string) ?? "",
    primaryContactEmail: (apiData.primaryContactEmail as string) ?? "",
    primaryContactRole: (apiData.primaryContactRole as string) ?? "",
    employeeCount: (apiData.employeeCount as string) ?? "",
    yearFounded:
      apiData.yearFounded != null && apiData.yearFounded !== ""
        ? Number(apiData.yearFounded)
        : (defaults.yearFounded as number),
    headquartersLocation: (apiData.headquartersLocation as string) ?? "",
    operatingRegions: Array.isArray(apiData.operatingRegions)
      ? (apiData.operatingRegions as string[])
      : [],
  };
}

const VendorMainForm = ({ type }: { type: string }) => {
  useEffect(() => {
    document.title = "AI Eval | Vendor Onboarding";
  }, []);

  const BASE_URL =
    import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";
  const vendor_Id = sessionStorage.getItem("userId");
  const organization_Id =
    sessionStorage.getItem("organizationId") ??
    sessionStorage.getItem("org_Id");
  const navigate = useNavigate();

  const allDataVendor = useMemo(
    () => getDefaultVendorFormState(type, vendor_Id, organization_Id),
    [type, vendor_Id, organization_Id],
  );

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);
  const [formVendorData, setFormVendorData] =
    useState<VendorDataInterface>(allDataVendor);
  const [fetchError, setFetchError] = useState<string | null>(null);
  // Path to vendor self attestation (set after successful onboarding submit; includes token when available)
  const [attestationPath, setAttestationPath] = useState<string>("");

  // Fetch existing vendor onboarding data for the logged-in user and map into form state
  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;

    let cancelled = false;
    const fetchVendorData = async () => {
      setFetchError(null);
      try {
        const response = await fetch(`${BASE_URL}/vendorOnboarding`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();
        let result: {
          success?: boolean;
          data?: Record<string, unknown>;
          message?: string;
        } = {};
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          setFetchError("Invalid response from server");
          return;
        }

        if (cancelled) return;

        if (!response.ok) {
          setFetchError(
            (result.message as string) || "Failed to load vendor data",
          );
          return;
        }

        const data = result.data;
        if (result.success && data && Object.keys(data).length > 0) {
          setFormVendorData((prev) => mapApiDataToFormState(data, prev));
        }
        // If no data or empty object, form stays as default (empty) — no need to set state
      } catch (err) {
        if (!cancelled) setFetchError("Network or server error");
      }
    };

    fetchVendorData();
    return () => {
      cancelled = true;
    };
  }, [BASE_URL]);

  const handleContinue = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);
  const Onboardingtoken = sessionStorage.getItem("onboardingToken");

  const handleBackToSelection = () =>
    navigate(`/onboarding/${Onboardingtoken}`);

  const handleSubmitPreview = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const onboardingToken = sessionStorage.getItem("onboardingToken");
    if (!onboardingToken) return;
    const orgId =
      sessionStorage.getItem("organizationId") ??
      sessionStorage.getItem("org_Id");
    try {
      const payload = {
        ...formVendorData,
        vendorId: sessionStorage.getItem("userId") ?? formVendorData.vendorId,
        organization_Id: orgId ?? formVendorData.organization_Id ?? undefined,
      };
      const response = await fetch(`${BASE_URL}/vendorOnboarding`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${onboardingToken}`,
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();
      console.log(result);
      if (response.ok) {
        setAllStepsFilled(true); // mark form completed
        // Navigate to vendor self attestation; include token in path so the link goes to the right route
        setAttestationPath(`/vendorSelfAttestation/${onboardingToken}`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CardContainerOnBoarding>
      {fetchError && (
        <p className="orgError" style={{ marginBottom: "0.5rem" }}>
          {fetchError}
        </p>
      )}
      <form onSubmit={handleSubmitPreview}>
        <CardOnBoarding className="card_vendor">
          {/* Render current step */}
          {currentStep === 0 && (
            <StepCompanyProfile
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}
          {currentStep === 1 && (
            <StepContactInformation
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}
          {currentStep === 2 && (
            <StepCompanyScale
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}
          {currentStep === 3 && (
            <StepGeopgraphy
              formVendorData={formVendorData}
              setFormVendorData={setFormVendorData}
            />
          )}

          {/* Step 4: Preview or Confirmation */}
          {currentStep === 4 && !allStepsFilled && (
            <StepVendorOnboardingPreview formVendorData={formVendorData} />
          )}
          {currentStep === 4 && allStepsFilled && (
            <CardConfirmation
              pageNavigateLink="Proceed to Vendor Self Attestation"
              navigateTo={
                attestationPath ||
                (Onboardingtoken ? `/vendorSelfAttestation/${Onboardingtoken}` : "/vendorSelfAttestation")
              }
            />
          )}
        </CardOnBoarding>

        {/* Navigation buttons */}
        <div className="vendor_action_btns">
          {/* Show back button only if confirmation is NOT shown */}
          {!allStepsFilled && (
            <div className="action_back">
              <Button
                type="button"
                onClick={currentStep === 0 ? handleBackToSelection : handleBack}
                className="back_btn"
              >
                <span>
                  <ChevronLeftCircle size={16} />
                  Back
                </span>
              </Button>
            </div>
          )}

          {/* Continue button for steps 0-3 */}
          {currentStep < 4 && (
            <div className="action_continue_btn">
              <Button
                onClick={handleContinue}
                type="button"
                className="continue_btn"
              >
                <span>
                  Continue <ChevronRightCircle size={16} />
                </span>
              </Button>
            </div>
          )}

          {/* Submit button for preview step */}
          {currentStep === 4 && !allStepsFilled && (
            <div className="action_submit_btn">
              <Button type="submit" className="submit_btn_vendor">
                <span>
                  Submit <Send size={16} />
                </span>
              </Button>
            </div>
          )}
        </div>
      </form>
    </CardContainerOnBoarding>
  );
};

export default VendorMainForm;
