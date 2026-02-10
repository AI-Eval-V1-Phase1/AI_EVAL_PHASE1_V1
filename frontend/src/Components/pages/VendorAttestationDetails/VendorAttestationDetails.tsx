import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FileCheck, Eye, Plus, Pencil, X, Shield, AlertTriangle, Check } from "lucide-react";
import Button from "../../UI/Button";
import StepVendorSelfAttestationPrev from "../VendorAttestations/StepVendorSelfAttestationPrev";
import type {
  VendorSelfAttestationPayload,
  VendorSelfAttestationFormState,
} from "../../types/vendorSelfAttestation";
import { buildFormStateFromApi, defaultDocumentUpload, mapApiCompanyProfile } from "../../../utils/vendorAttestationState";
import type { DocumentUploadState } from "../../types/vendorSelfAttestation";
import type { AttestationCompanyProfile } from "../../types/vendorSelfAttestation";
import "../UserManagement/user_management.css";
import "./vendor_attestation_details.css";

type AttestationStatus = "Draft" | "Completed" | "Rejected";

interface AttestationCardItem {
  id: string;
  title: string;
  status: AttestationStatus;
  submittedDate: string | null;
  expiryDate: string | null;
  recordId?: string | null;
}

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

/** Build form state from GET /attestation/:id response (attestation.formData). */
function buildFormStateFromFormData(formData: Record<string, unknown> | null | undefined): VendorSelfAttestationFormState {
  if (!formData || typeof formData !== "object") {
    return {
      companyProfile: {
        vendorType: "",
        sector: { public_sector: [], private_sector: [], non_profit_sector: [] },
        vendorMaturity: "",
        companyWebsite: "",
        companyDescription: "",
        employeeCount: "",
        yearFounded: "",
        headquartersLocation: "",
        operatingRegions: [],
      },
      attestation: {},
      documentUpload: defaultDocumentUpload,
    };
  }
  const companyProfile =
    formData.companyProfile && typeof formData.companyProfile === "object" && Object.keys(formData.companyProfile as object).length > 0
      ? mapApiCompanyProfile(formData.companyProfile as Record<string, unknown>)
      : {
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
  const attestation =
    formData.attestation && typeof formData.attestation === "object" && Object.keys(formData.attestation as object).length > 0
      ? (formData.attestation as VendorSelfAttestationPayload)
      : {};
  const docUpload = formData.documentUpload ?? formData.document_uploads;
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
  return { companyProfile, attestation, documentUpload };
}

const formatDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString();
  } catch {
    return "—";
  }
};

const VendorAttestationDetails = () => {
  const navigate = useNavigate();
  const [cards, setCards] = useState<AttestationCardItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewFormState, setPreviewFormState] = useState<VendorSelfAttestationFormState | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  useEffect(() => {
    document.title = "AI Eval | Attestation";
  }, []);

  // Fetch vendor self attestation from vendor_self_attestations (GET /vendorSelfAttestation)
  const fetchAttestations = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setError("Please log in to view attestations.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const organizationId = sessionStorage.getItem("organizationId") ?? "";
      const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
      const response = await fetch(`${BASE_URL}/vendorSelfAttestation${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await response.text();
      let result: {
        success?: boolean;
        attestation?: { id?: string; status?: string; product_name?: string; created_at?: string; updated_at?: string };
        attestations?: { id?: string; status?: string; product_name?: string; created_at?: string; updated_at?: string }[];
        companyProfile?: Record<string, unknown>;
        message?: string;
      } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setError("Invalid response from server");
        setLoading(false);
        return;
      }
      if (!response.ok) {
        setError((result.message as string) || "Failed to load attestations");
        setLoading(false);
        return;
      }

      const list: AttestationCardItem[] = [];
      if (result.success) {
        const items = Array.isArray(result.attestations) ? result.attestations : (result.attestation ? [result.attestation] : []);
        for (const attestation of items) {
          if (attestation?.id) {
            const apiStatus = (attestation.status ?? "").toUpperCase();
            const statusLabel = apiStatus === "COMPLETED" ? "Completed" : "Draft";
            const productName = (attestation.product_name ?? "").trim();
            list.push({
              id: attestation.id,
              title: productName || "Draft",
              status: statusLabel as AttestationStatus,
              submittedDate: attestation.updated_at ?? attestation.created_at ?? null,
              expiryDate: null,
              recordId: attestation.id,
            });
          }
        }
      }
      setCards(list);
    } catch {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttestations();
  }, [fetchAttestations]);

  // Refetch when user returns to this page (e.g. after saving draft on form) so card shows latest status
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") fetchAttestations();
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchAttestations]);

  const handleViewPreview = useCallback(async (recordId: string | null | undefined) => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    setPreviewOpen(true);
    setPreviewLoading(true);
    setPreviewFormState(null);
    try {
      const organizationId = sessionStorage.getItem("organizationId") ?? "";
      const params = new URLSearchParams();
      if (organizationId) params.set("organizationId", organizationId);
      if (recordId) params.set("id", recordId);
      const query = params.toString() ? `?${params.toString()}` : "";
      const response = await fetch(`${BASE_URL}/vendorSelfAttestation${query}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await response.text();
      let result: {
        success?: boolean;
        attestation?: Record<string, unknown>;
        companyProfile?: Record<string, unknown>;
      } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setPreviewLoading(false);
        return;
      }
      if (response.ok && result.success && (result.attestation || result.companyProfile)) {
        setPreviewFormState(buildFormStateFromApi({
          companyProfile: result.companyProfile,
          attestation: result.attestation,
        }));
      }
    } finally {
      setPreviewLoading(false);
    }
  }, []);

  const sortedCards = [...cards].sort((a, b) => {
    const dateA = a.submittedDate ? new Date(a.submittedDate).getTime() : 0;
    const dateB = b.submittedDate ? new Date(b.submittedDate).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <div className="sec_user_page attestation_page org_settings_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <FileCheck size={24} />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Attestation</h1>
            <p className="sub_title page_header_subtitle">Establish and maintain your vendor trust profile for the AI EVAL directory.</p>
          </div>
        </div>
        <div className="btn_user_page">
          <Button
            className="invite_user_btn"
            onClick={() => navigate("/vendorSelfAttestation?new=1", { state: { newAttestation: true } })}
          >
            <Plus size={24} />
            Attestation
          </Button>
        </div>
      </div>

      {/* Directory Listing Requirements - at the top */}
      <div className="attestation_section attestation_directory_requirements">
        <div className="attestation_section_header">
          <AlertTriangle className="attestation_section_icon attestation_section_icon_warning" size={24} />
          <h2 className="attestation_section_title">Directory Listing Requirements</h2>
        </div>
        <div className="attestation_requirements_grid">
          <div className="attestation_requirement_item">
            <h3 className="attestation_requirement_heading">Public Directory</h3>
            <p>Complete your attestation and achieve a passing trust score to appear in the vendor directory visible to buyers.</p>
          </div>
          <div className="attestation_requirement_item">
            <h3 className="attestation_requirement_heading">Keep It Updated</h3>
            <p>You can edit your attestation at any time to reflect changes in your product, certifications, or practices.</p>
          </div>
          <div className="attestation_requirement_item">
            <h3 className="attestation_requirement_heading">Continuous Trust</h3>
            <p>Regular updates to your attestation help maintain your trust score and directory standing.</p>
          </div>
        </div>
      </div>

      {/* Trust Profile Attestation */}
      <div className="attestation_section attestation_trust_profile">
        <div className="attestation_section_header">
          <Shield className="attestation_section_icon attestation_section_icon_primary" size={24} />
          <div>
            <h2 className="attestation_section_title">Trust Profile Attestation</h2>
            <p className="attestation_section_subtitle">Complete this to appear in the approved vendor directory.</p>
          </div>
        </div>

        <p className="attestation_covers_heading">Your self-attestation covers:</p>
        <div className="attestation_covers_grid">
          <ul className="attestation_covers_list">
            <li><Check size={16} className="attestation_check" /> Product profile and capabilities</li>
            <li><Check size={16} className="attestation_check" /> AI safety and testing practices</li>
            <li><Check size={16} className="attestation_check" /> Compliance certifications</li>
            <li><Check size={16} className="attestation_check" /> Data handling policies</li>
          </ul>
          <ul className="attestation_covers_list">
            <li><Check size={16} className="attestation_check" /> Operational reliability</li>
            <li><Check size={16} className="attestation_check" /> Deployment options</li>
            <li><Check size={16} className="attestation_check" /> Risk mitigations</li>
            <li><Check size={16} className="attestation_check" /> Evidence documentation</li>
          </ul>
        </div>

        <h3 className="attestation_your_heading">YOUR ATTESTATIONS</h3>

        {loading && (
          <div className="vendor_attestation_loading">Loading attestations…</div>
        )}
        {error && (
          <div className="vendor_attestation_error">{error}</div>
        )}
        {!loading && !error && cards.length > 0 && (
          <div className="vendor_attestation_cards">
            {sortedCards.map((item) => (
              <div key={item.id} className="vendor_attestation_card">
                <h2 className="vendor_attestation_card_title">{item.title}</h2>
                <div className="vendor_attestation_card_meta">
                  <div className="vendor_attestation_card_meta_row">
                    <span className="vendor_attestation_card_meta_label">Status</span>
                    <span className={`vendor_attestation_status vendor_attestation_status_${item.status.toLowerCase()}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="vendor_attestation_card_meta_row">
                    <span className="vendor_attestation_card_meta_label">Submitted</span>
                    <span>{formatDate(item.submittedDate)}</span>
                  </div>
                </div>
                <div className="vendor_attestation_card_actions">
                  {item.status === "Draft" && (
                    <Link
                      to={`/vendorSelfAttestation?edit=${encodeURIComponent(item.recordId ?? "")}`}
                      state={{ editId: item.recordId }}
                      className="vendor_attestation_card_btn vendor_attestation_card_btn_primary"
                    >
                      <Pencil size={14} />
                      Edit
                    </Link>
                  )}
                  {item.status === "Completed" && (
                    <button
                      type="button"
                      className="vendor_attestation_card_btn vendor_attestation_card_btn_secondary"
                      onClick={() => handleViewPreview(item.recordId)}
                    >
                      <Eye size={14} />
                      View
                    </button>
                  )}
                  {item.status === "Rejected" && (
                    <>
                      <button
                        type="button"
                        className="vendor_attestation_card_btn vendor_attestation_card_btn_secondary"
                        onClick={() => handleViewPreview(item.recordId)}
                      >
                        <Eye size={14} />
                        View
                      </button>
                      <Link
                        to="/vendorSelfAttestation"
                        state={{ editId: item.recordId }}
                        className="vendor_attestation_card_btn vendor_attestation_card_btn_primary"
                      >
                        <Pencil size={14} />
                        Edit
                      </Link>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        {!loading && !error && cards.length === 0 && (
          <div className="vendor_attestation_loading">No attestations found.</div>
        )}
      </div>

      {previewOpen && (
        <div className="vendor_attestation_preview_modal_overlay" onClick={() => setPreviewOpen(false)}>
          <div
            className="vendor_attestation_preview_modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="vendor_attestation_preview_modal_header">
              <h2>Attestation Preview</h2>
              <button
                type="button"
                className="vendor_attestation_preview_modal_close"
                onClick={() => setPreviewOpen(false)}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="vendor_attestation_preview_modal_body">
              {previewLoading && <div className="vendor_attestation_loading">Loading preview…</div>}
              {!previewLoading && previewFormState && (
                <StepVendorSelfAttestationPrev formState={previewFormState} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorAttestationDetails;
