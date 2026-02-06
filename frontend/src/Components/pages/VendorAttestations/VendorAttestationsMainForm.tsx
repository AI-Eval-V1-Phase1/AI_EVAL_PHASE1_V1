import { useEffect, useState, useCallback } from "react";
import CardContainerOnBoarding from "../../UI/CardContainerOnBoarding";
import CardOnBoarding from "../../UI/CardOnBoarding";
import Button from "../../UI/Button";
import { ChevronLeftCircle, ChevronRightCircle, Send } from "lucide-react";
import StepCompanyProfileAttestation from "./StepCompanyProfileAttestation";
import StepDocUpload from "./StepDocUpload";
import AttestationDynamicStep from "./AttestationDynamicStep";
import StepVendorSelfAttestationPrev from "./StepVendorSelfAttestationPrev";
import VendorSelfAttestationConfirmation from "./VendorSelfAttestationConfirmation";
import FormField from "../../UI/FormField";
import FileUpload from "../../UI/FileUpload";
import { VENDOR_SELF_ATTESTATION } from "../../../constants/vendorAttestionData";
import { EVIDENCE_TESTING_POLICY_HELPER_TEXT, MAX_FILE_SIZE_BYTES } from "../../../constants/vendorAttestationDocumentConstants";
import type {
  AttestationCompanyProfile,
  VendorSelfAttestationPayload,
  VendorSelfAttestationFormState,
  DocumentUploadState,
} from "../../../types/vendorSelfAttestation";

const defaultCompanyProfile: AttestationCompanyProfile = {
  vendorType: "",
  sector: { public_sector: [], private_sector: [], non_profit_sector: [] },
  vendorMaturity: "",
  companyWebsite: "",
  companyDescription: "",
  employeeCount: "",
  yearFounded: "",
  headquartersLocation: "",
  operatingRegions: [],
};

const defaultAttestation: VendorSelfAttestationPayload = {};

const defaultDocumentUpload: DocumentUploadState = {
  "0": [],
  "1": [],
  "2": { categories: [], byCategory: {} },
  evidenceTestingPolicy: [],
};

const defaultFormState: VendorSelfAttestationFormState = {
  companyProfile: defaultCompanyProfile,
  attestation: defaultAttestation,
  documentUpload: defaultDocumentUpload,
};

/** Map API companyProfile (from vendor_onboarding) to AttestationCompanyProfile */
function mapApiCompanyProfile(api: Record<string, unknown>): AttestationCompanyProfile {
  const sector = api.sector;
  let sectorNorm: Record<string, string[]> = {
    public_sector: [],
    private_sector: [],
    non_profit_sector: [],
  };
  if (sector && typeof sector === "object" && !Array.isArray(sector)) {
    const s = sector as Record<string, unknown>;
    sectorNorm = {
      public_sector: Array.isArray(s.public_sector) ? (s.public_sector as string[]) : [],
      private_sector: Array.isArray(s.private_sector) ? (s.private_sector as string[]) : [],
      non_profit_sector: Array.isArray(s.non_profit_sector) ? (s.non_profit_sector as string[]) : [],
    };
  }
  return {
    vendorType: (api.vendorType as string) ?? "",
    sector: sectorNorm,
    vendorMaturity: (api.vendorMaturity as string) ?? "",
    companyWebsite: (api.companyWebsite as string) ?? "",
    companyDescription: (api.companyDescription as string) ?? "",
    employeeCount: (api.employeeCount as string) ?? "",
    yearFounded: api.yearFounded != null ? Number(api.yearFounded) : "",
    headquartersLocation: (api.headquartersLocation as string) ?? "",
    operatingRegions: Array.isArray(api.operatingRegions) ? (api.operatingRegions as string[]) : [],
  };
}

const VendorAttestationsMainForm = () => {
  useEffect(() => {
    document.title = "AI Eval | Vendor Attestation";
  }, []);

  const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

  const [currentStep, setCurrentStep] = useState<number>(0);
  const [allStepsFilled, setAllStepsFilled] = useState<boolean>(false);
  const [formState, setFormState] = useState<VendorSelfAttestationFormState>(defaultFormState);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  // Fetch company profile + attestation on mount (use bearerToken or onboardingToken)
  const [fetchDone, setFetchDone] = useState(false);
  useEffect(() => {
    const token =
      sessionStorage.getItem("bearerToken") ?? sessionStorage.getItem("onboardingToken");
    if (!token) {
      setFetchError("Please log in or complete onboarding to load your data.");
      setFetchDone(true);
      return;
    }

    let cancelled = false;
    (async () => {
      setFetchError(null);
      try {
        const response = await fetch(`${BASE_URL}/vendorSelfAttestation`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const text = await response.text();
        let result: {
          success?: boolean;
          companyProfile?: Record<string, unknown>;
          attestation?: Record<string, unknown>;
          message?: string;
        } = {};
        try {
          result = text ? JSON.parse(text) : {};
        } catch {
          if (!cancelled) setFetchError("Invalid response from server");
          setFetchDone(true);
          return;
        }
        if (cancelled) return;
        if (!response.ok) {
          setFetchError((result.message as string) || "Failed to load data");
          setFetchDone(true);
          return;
        }
        if (result.success) {
          const companyProfile =
            result.companyProfile && Object.keys(result.companyProfile).length > 0
              ? mapApiCompanyProfile(result.companyProfile)
              : defaultCompanyProfile;
          const attestation =
            result.attestation && Object.keys(result.attestation).length > 0
              ? (result.attestation as VendorSelfAttestationPayload)
              : defaultAttestation;
          const docUpload = result.attestation?.document_uploads;
          let documentUpload: DocumentUploadState = defaultDocumentUpload;
          if (docUpload && typeof docUpload === "object") {
            const d = docUpload as Record<string, unknown>;
            const slot2 = d["2"];
            let regulatory2: DocumentUploadState["2"] = { categories: [], byCategory: {} };
            if (slot2 != null && typeof slot2 === "object" && !Array.isArray(slot2)) {
              const s = slot2 as Record<string, unknown>;
              regulatory2 = {
                categories: Array.isArray(s.categories) ? (s.categories as string[]) : [],
                byCategory:
                  s.byCategory && typeof s.byCategory === "object"
                    ? (s.byCategory as Record<string, string[]>)
                    : {},
              };
            } else if (Array.isArray(slot2)) {
              regulatory2 = { categories: [], byCategory: {} };
            }
            documentUpload = {
              "0": Array.isArray(d["0"]) ? (d["0"] as string[]) : [],
              "1": Array.isArray(d["1"]) ? (d["1"] as string[]) : [],
              "2": regulatory2,
              evidenceTestingPolicy: Array.isArray(d.evidenceTestingPolicy)
                ? (d.evidenceTestingPolicy as string[])
                : [],
            };
          }
          setFormState((prev) => ({
            ...prev,
            companyProfile,
            attestation,
            documentUpload,
          }));
        }
        setFetchDone(true);
      } catch {
        if (!cancelled) {
          setFetchError("Network or server error");
          setFetchDone(true);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [BASE_URL]);

  const setCompanyProfile = useCallback((next: React.SetStateAction<AttestationCompanyProfile>) => {
    setFormState((prev) => ({
      ...prev,
      companyProfile: typeof next === "function" ? next(prev.companyProfile) : next,
    }));
  }, []);

  const setAttestation = useCallback((next: React.SetStateAction<VendorSelfAttestationPayload>) => {
    setFormState((prev) => ({
      ...prev,
      attestation: typeof next === "function" ? next(prev.attestation) : next,
    }));
  }, []);

  const setDocumentUpload = useCallback(
    (next: React.SetStateAction<DocumentUploadState>) => {
      setFormState((prev) => ({
        ...prev,
        documentUpload:
          typeof next === "function" ? next(prev.documentUpload ?? defaultDocumentUpload) : next,
      }));
    },
    []
  );

  const handleContinue = () => setCurrentStep((prev) => prev + 1);
  const handleBack = () => setCurrentStep((prev) => prev - 1);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    const token =
      sessionStorage.getItem("bearerToken") ?? sessionStorage.getItem("onboardingToken");
    if (!token) {
      setSubmitError("Not authenticated. Please log in or complete onboarding.");
      return;
    }
    try {
      const response = await fetch(`${BASE_URL}/vendorSelfAttestation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formState.attestation,
          document_uploads: formState.documentUpload ?? undefined,
        }),
      });
      const text = await response.text();
      let result: { success?: boolean; message?: string } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setSubmitError("Invalid response from server");
        return;
      }
      if (!response.ok) {
        setSubmitError((result.message as string) || "Submit failed");
        return;
      }
      if (result.success) setAllStepsFilled(true);
    } catch {
      setSubmitError("Network or server error");
    }
  };

  return (
    <>
      <CardContainerOnBoarding>
        {fetchError && (
          <p className="orgError" style={{ marginBottom: "0.5rem" }}>
            {fetchError}
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <CardOnBoarding className="card_vendor">
            {currentStep === 0 && !fetchDone && (
              <p style={{ padding: "1rem" }}>Loading company profile…</p>
            )}
            {currentStep === 0 && fetchDone && (
              <StepCompanyProfileAttestation
                companyProfile={formState.companyProfile}
                setCompanyProfile={setCompanyProfile}
              />
            )}
            {currentStep === 1 && (
              <StepDocUpload
                data={VENDOR_SELF_ATTESTATION.document_upload}
                documentUpload={formState.documentUpload ?? defaultDocumentUpload}
                setDocumentUpload={setDocumentUpload}
              />
            )}
            {currentStep === 2 && (
              <AttestationDynamicStep
                title="Product Profile"
                sectionKey="product_profile"
                data={VENDOR_SELF_ATTESTATION.product_profile}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 3 && (
              <AttestationDynamicStep
                title="AI Technical Capabilities"
                sectionKey="ai_technical_capabilities"
                data={VENDOR_SELF_ATTESTATION.ai_technical_capabilities}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 4 && (
              <AttestationDynamicStep
                title="Compliance & Certifications"
                sectionKey="compliance_certifications"
                data={VENDOR_SELF_ATTESTATION.compliance_certifications}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 5 && (
              <AttestationDynamicStep
                title="Data Handling & Privacy"
                sectionKey="data_handling_privacy"
                data={VENDOR_SELF_ATTESTATION.data_handling_privacy}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 6 && (
              <AttestationDynamicStep
                title="AI Safety & Testing"
                sectionKey="ai_safety_testing"
                data={VENDOR_SELF_ATTESTATION.ai_safety_testing}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 7 && (
              <AttestationDynamicStep
                title="Operations & Reliability"
                sectionKey="operations_reliability"
                data={VENDOR_SELF_ATTESTATION.operations_reliability}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 8 && (
              <AttestationDynamicStep
                title="Deployment & Architecture"
                sectionKey="deployment_architecture"
                data={VENDOR_SELF_ATTESTATION.deployment_architecture}
                attestation={formState.attestation}
                setAttestation={setAttestation}
              />
            )}
            {currentStep === 9 && (
              <>
                <AttestationDynamicStep
                  title="Evidence & Supporting Documentation"
                  sectionKey="evidence_supporting_documentation"
                  data={VENDOR_SELF_ATTESTATION.evidence_supporting_documentation}
                  attestation={formState.attestation}
                  setAttestation={setAttestation}
                />
                {/* Optional: Upload Testing and Policy Documentation */}
                <div className="form_fields_vendor" style={{ marginTop: "1.5rem" }}>
                  <FormField
                    label="Upload Testing and Policy Documentation (Optional)"
                    mandatory={false}
                    tooltipText={EVIDENCE_TESTING_POLICY_HELPER_TEXT}
                  >
                    <p className="evidence-helper" style={{ fontSize: "0.875rem", color: "#6b7280", marginBottom: "0.5rem" }}>
                      {EVIDENCE_TESTING_POLICY_HELPER_TEXT}
                    </p>
                    <FileUpload
                      multiple
                      accept=".pdf,.doc,.docx,.ppt,.pptx"
                      maxSizeBytes={MAX_FILE_SIZE_BYTES}
                      value={formState.documentUpload?.evidenceTestingPolicy ?? []}
                      onFilesChange={(fileNames) =>
                        setDocumentUpload((prev) => ({
                          ...prev,
                          evidenceTestingPolicy: fileNames,
                        }))
                      }
                    />
                  </FormField>
                </div>
              </>
            )}
            {/* Preview step: appears immediately after Evidence & Supporting Documentation when user clicks Continue */}
            {currentStep === 10 && !allStepsFilled && (
              <StepVendorSelfAttestationPrev
                formState={formState}
                onNavigateToStep={setCurrentStep}
              />
            )}
            {currentStep === 10 && allStepsFilled && (
              <VendorSelfAttestationConfirmation />
            )}
          </CardOnBoarding>

          {submitError && (
            <p className="orgError" style={{ marginTop: "0.5rem" }}>
              {submitError}
            </p>
          )}

          <div className="vendor_action_btns">
            {!allStepsFilled && (
              <div className="action_back">
                <Button
                  type="button"
                  onClick={currentStep > 0 ? handleBack : undefined}
                  disabled={currentStep === 0}
                  className="back_btn"
                >
                  <span>
                    <ChevronLeftCircle size={16} />
                    Back
                  </span>
                </Button>
              </div>
            )}

            {currentStep < 10 && (
              <div className="action_continue_btn">
                <Button type="button" onClick={handleContinue} className="continue_btn">
                  <span>
                    Continue <ChevronRightCircle size={16} />
                  </span>
                </Button>
              </div>
            )}

            {currentStep === 10 && !allStepsFilled && (
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
    </>
  );
};

export default VendorAttestationsMainForm;
