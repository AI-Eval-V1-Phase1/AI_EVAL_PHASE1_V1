import { useEffect, useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FileCheck,
  Eye,
  Plus,
  Pencil,
  X,
  Shield,
  AlertTriangle,
  Check,
  CircleCheck,
  CheckCircle2,
  FileText,
  XCircle,
  Calendar,
  Search,
} from "lucide-react";
import Button from "../../UI/Button";
import StepVendorSelfAttestationPrev from "../VendorAttestations/StepVendorSelfAttestationPrev";
import type {
  VendorSelfAttestationPayload,
  VendorSelfAttestationFormState,
} from "../../types/vendorSelfAttestation";
import {
  buildFormStateFromApi,
  defaultDocumentUpload,
  mapApiCompanyProfile,
} from "../../../utils/vendorAttestationState";
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
  completedBy?: string | null;
}

const BASE_URL =
  import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

/** Build form state from GET /attestation/:id response (attestation.formData). */
function buildFormStateFromFormData(
  formData: Record<string, unknown> | null | undefined,
): VendorSelfAttestationFormState {
  if (!formData || typeof formData !== "object") {
    return {
      companyProfile: {
        vendorType: "",
        sector: {
          public_sector: [],
          private_sector: [],
          non_profit_sector: [],
        },
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
    formData.companyProfile &&
    typeof formData.companyProfile === "object" &&
    Object.keys(formData.companyProfile as object).length > 0
      ? mapApiCompanyProfile(formData.companyProfile as Record<string, unknown>)
      : {
          vendorType: "",
          sector: {
            public_sector: [],
            private_sector: [],
            non_profit_sector: [],
          },
          vendorMaturity: "",
          companyWebsite: "",
          companyDescription: "",
          employeeCount: "",
          yearFounded: "",
          headquartersLocation: "",
          operatingRegions: [],
        };
  const attestation =
    formData.attestation &&
    typeof formData.attestation === "object" &&
    Object.keys(formData.attestation as object).length > 0
      ? (formData.attestation as VendorSelfAttestationPayload)
      : {};
  const docUpload = formData.documentUpload ?? formData.document_uploads;
  let documentUpload: DocumentUploadState = defaultDocumentUpload;
  if (docUpload && typeof docUpload === "object") {
    const d = docUpload as Record<string, unknown>;
    const slot2 = d["2"];
    let regulatory2: DocumentUploadState["2"] = {
      categories: [],
      byCategory: {},
    };
    if (slot2 != null && typeof slot2 === "object" && !Array.isArray(slot2)) {
      const s = slot2 as Record<string, unknown>;
      regulatory2 = {
        categories: Array.isArray(s.categories)
          ? (s.categories as string[])
          : [],
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
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getDate().toString().padStart(2, "0");
    const month = d.toLocaleDateString("en-GB", { month: "short" });
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
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
  const [previewFormState, setPreviewFormState] =
    useState<VendorSelfAttestationFormState | null>(null);
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
      const query = organizationId
        ? `?organizationId=${encodeURIComponent(organizationId)}`
        : "";
      const response = await fetch(
        `${BASE_URL}/vendorSelfAttestation${query}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const text = await response.text();
      let result: {
        success?: boolean;
        attestation?: {
          id?: string;
          status?: string;
          product_name?: string;
          created_at?: string;
          updated_at?: string;
        };
        attestations?: {
          id?: string;
          status?: string;
          product_name?: string;
          created_at?: string;
          updated_at?: string;
        }[];
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
        const items = Array.isArray(result.attestations)
          ? result.attestations
          : result.attestation
            ? [result.attestation]
            : [];
        for (const attestation of items) {
          if (attestation?.id) {
            const apiStatus = (attestation.status ?? "").toUpperCase();
            const statusLabel =
              apiStatus === "COMPLETED" ? "Completed" : "Draft";
            const productName = (attestation.product_name ?? "").trim();
            const completedByName =
              (attestation as { completedBy?: { name?: string } }).completedBy
                ?.name ?? null;
            list.push({
              id: attestation.id,
              title: productName || "Draft",
              status: statusLabel as AttestationStatus,
              submittedDate:
                attestation.updated_at ?? attestation.created_at ?? null,
              expiryDate: null,
              recordId: attestation.id,
              completedBy: completedByName ?? null,
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
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [fetchAttestations]);

  const [previewAttestationId, setPreviewAttestationId] = useState<
    string | null
  >(null);
  const [attestationSearch, setAttestationSearch] = useState("");

  const handleOpenDocument = useCallback(
    async (fileName: string) => {
      const token = sessionStorage.getItem("bearerToken");
      if (!token || !previewAttestationId) return;
      const url = `${BASE_URL}/vendorSelfAttestation/document/${encodeURIComponent(previewAttestationId)}/${encodeURIComponent(fileName)}`;
      try {
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) return;
        const blob = await res.blob();
        const blobUrl = URL.createObjectURL(blob);
        const w = window.open(blobUrl, "_blank", "noopener,noreferrer");
        if (w) setTimeout(() => URL.revokeObjectURL(blobUrl), 3000);
        else URL.revokeObjectURL(blobUrl);
      } catch {
        // ignore
      }
    },
    [previewAttestationId],
  );

  const handleViewPreview = useCallback(
    async (recordId: string | null | undefined) => {
      const token = sessionStorage.getItem("bearerToken");
      if (!token) return;
      setPreviewAttestationId(recordId ?? null);
      setPreviewOpen(true);
      setPreviewLoading(true);
      setPreviewFormState(null);
      try {
        const organizationId = sessionStorage.getItem("organizationId") ?? "";
        const params = new URLSearchParams();
        if (organizationId) params.set("organizationId", organizationId);
        if (recordId) params.set("id", recordId);
        const query = params.toString() ? `?${params.toString()}` : "";
        const response = await fetch(
          `${BASE_URL}/vendorSelfAttestation${query}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        );
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
        if (
          response.ok &&
          result.success &&
          (result.attestation || result.companyProfile)
        ) {
          setPreviewFormState(
            buildFormStateFromApi({
              companyProfile: result.companyProfile,
              attestation: result.attestation,
            }),
          );
        }
      } finally {
        setPreviewLoading(false);
      }
    },
    [],
  );

  const sortedCards = [...cards].sort((a, b) => {
    const dateA = a.submittedDate ? new Date(a.submittedDate).getTime() : 0;
    const dateB = b.submittedDate ? new Date(b.submittedDate).getTime() : 0;
    return dateB - dateA;
  });
  const attestationSearchLower = attestationSearch.trim().toLowerCase();
  const filteredAttestations =
    attestationSearchLower === ""
      ? sortedCards
      : sortedCards.filter((item) =>
          (item.title ?? "").toLowerCase().includes(attestationSearchLower),
        );

  return (
    <div className="sec_user_page attestation_page org_settings_page">
      <div className="heading_user_page page_header_align">
        <div className="headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <FileCheck size={24} className="header_icon_svg"/>
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Attestation</h1>
            <p className="sub_title page_header_subtitle">
              Establish and maintain your vendor trust profile for the AI EVAL
              directory.
            </p>
          </div>
        </div>
        <div className="btn_user_page">
          <Button
            className="invite_user_btn"
            onClick={() =>
              navigate("/vendorSelfAttestation?new=1", {
                state: { newAttestation: true },
              })
            }
          >
            <Plus size={24} />
            Attestation
          </Button>
        </div>
      </div>

      {/* Trust Profile Attestation */}
      <div className="attestation_section attestation_trust_profile">
        <div className="attestation_section_header">
          <span>
            <Shield
              className="attestation_section_icon attestation_section_icon_primary"
              size={24}
            />
          </span>
          <div>
            <h2 className="attestation_section_title">
              Trust Profile Attestation
            </h2>
            <p className="attestation_section_subtitle">
              Complete this to appear in the approved vendor directory.
            </p>
          </div>
        </div>

        <p className="attestation_covers_heading">
          Your self-attestation covers:
        </p>
        <div className="attestation_covers_grid">
          <ul className="attestation_covers_list">
            <li>
              <CircleCheck size={16} className="attestation_check" /> Product
              profile and capabilities
            </li>
            <li>
              <CircleCheck size={16} className="attestation_check" /> AI safety
              and testing practices
            </li>
            <li>
              <CircleCheck size={16} className="attestation_check" /> Compliance
              certifications
            </li>
            <li>
              <CircleCheck size={16} className="attestation_check" /> Data
              handling policies
            </li>
          </ul>
          <ul className="attestation_covers_list">
            <li>
              <CircleCheck size={16} className="attestation_check" />{" "}
              Operational reliability
            </li>
            <li>
              <CircleCheck size={16} className="attestation_check" /> Deployment
              options
            </li>
            <li>
              <CircleCheck size={16} className="attestation_check" /> Risk
              mitigations
            </li>
            <li>
              <CircleCheck size={16} className="attestation_check" /> Evidence
              documentation
            </li>
          </ul>
        </div>

        <div className="attestation_list_header_row">
          <h3 className="your_assessments_title">YOUR ATTESTATIONS</h3>
          <div className="attestation_search_wrap">
            <Search size={18} className="attestation_search_icon" aria-hidden />
            <input
              type="search"
              placeholder="Search attestations…"
              value={attestationSearch}
              onChange={(e) => setAttestationSearch(e.target.value)}
              className="attestation_search_input"
              aria-label="Search attestations by name"
            />
          </div>
        </div>

        {loading && (
          <div className="vendor_attestation_loading">
            Loading attestations…
          </div>
        )}
        {error && <div className="vendor_attestation_error">{error}</div>}
        {!loading && !error && cards.length > 0 && (
          <div className="attestation_list_rows">
            {filteredAttestations.length === 0 ? (
              <p className="attestation_search_no_results">
                No attestations match your search.
              </p>
            ) : (
              filteredAttestations.map((item) => (
                <div key={item.id} className="vendor_overview_attestation_row">
                  {item.status === "Draft" && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />}
                  {item.status === "Completed" && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_check" aria-hidden />}
                  {item.status === "Rejected" && <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_rejected" aria-hidden />}
                  <div className="vendor_overview_attestation_content">
                    <p className="vendor_overview_attestation_name">{item.title}</p>
                    <p className={`vendor_overview_attestation_status_label${item.status === "Draft" ? " vendor_overview_attestation_status_label_draft" : item.status === "Rejected" ? " vendor_overview_attestation_status_label_rejected" : ""}`}>
                      {item.status}
                    </p>
                    <p className="vendor_overview_attestation_by">
                      {item.status === "Draft" ? "Updated by:" : "Completed by:"} {item.completedBy?.trim() || "—"}
                    </p>
                    <p className="vendor_overview_attestation_date">
                      {item.status === "Draft" ? "Updated" : "Submitted"}: {formatDate(item.submittedDate)}
                    </p>
                  </div>
                  <div className="vendor_overview_attestation_actions">
                    {item.status === "Draft" && (
                      <Link
                        to={`/vendorSelfAttestation?edit=${encodeURIComponent(item.recordId ?? "")}`}
                        state={{ editId: item.recordId }}
                        className="vendor_overview_btn_view"
                      >
                        <Pencil size={14} aria-hidden />
                        Edit
                      </Link>
                    )}
                    {item.status === "Completed" && (
                      <button
                        type="button"
                        className="vendor_overview_btn_view"
                        onClick={() => handleViewPreview(item.recordId)}
                      >
                        <Eye size={14} aria-hidden />
                        View
                      </button>
                    )}
                    {item.status === "Rejected" && (
                      <>
                        <button
                          type="button"
                          className="vendor_overview_btn_view"
                          onClick={() => handleViewPreview(item.recordId)}
                        >
                          <Eye size={14} aria-hidden />
                          View
                        </button>
                        <Link
                          to="/vendorSelfAttestation"
                          state={{ editId: item.recordId }}
                          className="vendor_overview_btn_view"
                        >
                          <Pencil size={14} aria-hidden />
                          Edit
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
        {!loading && !error && cards.length === 0 && (
          <div className="vendor_attestation_loading">
            No attestations found.
          </div>
        )}
      </div>
      {/* Directory Listing Requirements - at the top */}
      <div className="attestation_section attestation_directory_requirements">
        <div className="attestation_section_header">
          <AlertTriangle
            className="attestation_section_icon attestation_section_icon_warning"
            size={24}
          />
          <h2 className="attestation_section_title">
            Directory Listing Requirements
          </h2>
        </div>
        <div className="attestation_requirements_grid">
          <div className="attestation_requirement_item">
            <h3 className="attestation_requirement_heading">
              Public Directory
            </h3>
            <p>
              Complete your attestation and achieve a passing trust score to
              appear in the vendor directory visible to buyers.
            </p>
          </div>
          <div className="attestation_requirement_item">
            <h3 className="attestation_requirement_heading">Keep It Updated</h3>
            <p>
              You can edit your attestation at any time to reflect changes in
              your product, certifications, or practices.
            </p>
          </div>
          <div className="attestation_requirement_item">
            <h3 className="attestation_requirement_heading">
              Continuous Trust
            </h3>
            <p>
              Regular updates to your attestation help maintain your trust score
              and directory standing.
            </p>
          </div>
        </div>
      </div>

      {previewOpen && (
        <div
          className="vendor_attestation_preview_modal_overlay"
          onClick={() => setPreviewOpen(false)}
        >
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
              {previewLoading && (
                <div className="vendor_attestation_loading">
                  Loading preview…
                </div>
              )}
              {!previewLoading && previewFormState && (
                <StepVendorSelfAttestationPrev
                  formState={previewFormState}
                  attestationId={previewAttestationId}
                  onOpenDocument={handleOpenDocument}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorAttestationDetails;
