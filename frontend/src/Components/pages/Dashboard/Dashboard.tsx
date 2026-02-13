import { useEffect, useState, useCallback } from "react";
<<<<<<< HEAD
import { Link, useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  LayoutDashboard,
  Building2,
  Users,
  ShoppingBag,
  FileCheck,
  Activity,
  Shield,
  AlertTriangle,
  Target,
  ExternalLink,
  ChevronDown,
  BarChart3,
  Pencil,
  Plus,
} from "lucide-react";
import { MetricCard, KPICard, RiskCard } from "../../UI/Card";
import Button from "../../UI/Button";
=======
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, LayoutDashboard } from "lucide-react";
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
import "./Dashboard.css";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

<<<<<<< HEAD
interface AssessmentRow {
  assessmentId: number;
  type: string;
  status: string;
  createdAt: string | null;
  updatedAt: string | null;
  organizationId: string | null;
  productName?: string | null;
  vendorName?: string | null;
  cotsUpdatedAt?: string | null;
  completedByUserEmail?: string | null;
  completedByUserFirstName?: string | null;
  completedByUserLastName?: string | null;
  completedByUserName?: string | null;
  [key: string]: unknown;
}

interface DashboardStats {
  totalOrganizations: number;
  totalVendors: number;
  totalBuyers: number;
  totalAttestations: number;
}

const SystemAdminOverview = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setError("Please log in to view dashboard.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    fetch(`${BASE_URL}/dashboardStats`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data) {
          setStats(result.data);
        } else {
          setError(result?.message ?? "Failed to load dashboard stats");
        }
      })
      .catch(() => setError("Network or server error"))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="vendor_overview_page sec_user_page org_settings_page">
      <div className="vendor_overview_heading page_header_align">
        <div className="vendor_overview_headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <LayoutDashboard size={24} />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">System Admin Overview</h1>
            <p className="vendor_overview_subtitle page_header_subtitle">
              Platform-wide metrics and activity summary.
            </p>
          </div>
        </div>
      </div>

      {loading && (
        <div className="vendor_overview_loading">Loading dashboard…</div>
      )}
      {error && (
        <div className="vendor_overview_error">{error}</div>
      )}
      {!loading && !error && stats && (
        <div>
        <div className="vendor_overview_metrics vendor_overview_metrics_four">
          <div className="vendor_overview_metric_card">
            <span className="vendor_overview_metric_card_icon" aria-hidden>
              
            </span>
            <p className="vendor_overview_metric_title"><Building2 size={22} />Total Organizations</p>
            <p className="vendor_overview_metric_value">{stats.totalOrganizations}</p>
            <p className="vendor_overview_metric_desc">Registered organizations on the platform</p>
          </div>
          <div className="vendor_overview_metric_card">
            <span className="vendor_overview_metric_card_icon" aria-hidden>
              
            </span>
            <p className="vendor_overview_metric_title"><ShoppingBag size={22} />Total Vendors</p>
            <p className="vendor_overview_metric_value">{stats.totalVendors}</p>
            <p className="vendor_overview_metric_desc">Vendors who completed onboarding</p>
          </div>
          <div className="vendor_overview_metric_card">
            <span className="vendor_overview_metric_card_icon" aria-hidden>
            </span>
              
            <p className="vendor_overview_metric_title"><Users size={22} />Total Buyers</p>
            <p className="vendor_overview_metric_value">{stats.totalBuyers}</p>
            <p className="vendor_overview_metric_desc">Buyers who completed onboarding</p>
          </div>
          <div className="vendor_overview_metric_card">
            <span className="vendor_overview_metric_card_icon" aria-hidden>
            </span>
            
              
            <p className="vendor_overview_metric_title"><FileCheck size={22} />Attestations</p>
            <p className="vendor_overview_metric_value">{stats.totalAttestations}</p>
            <p className="vendor_overview_metric_desc">Vendor self-attestations submitted</p>
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
interface AttestationItem {
  id: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const formatUpdatedDate = (dateStr: string | null | undefined): string => {
<<<<<<< HEAD
  const formatted = formatGovDate(dateStr);
  return formatted === "—" ? "—" : `Updated: ${formatted}`;
};

const formatCompletedDate = (dateStr: string | null | undefined): string => {
  const formatted = formatGovDate(dateStr);
  return formatted === "—" ? "—" : `Completed: ${formatted}`;
=======
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `Updated: ${day}/${month}/${year}`;
  } catch {
    return "—";
  }
};

const formatCompletedDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "—";
  try {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return "—";
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    return `Completed: ${day}/${month}/${year}`;
  } catch {
    return "—";
  }
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
};

const VendorOverview = () => {
  const [attestations, setAttestations] = useState<AttestationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        attestation?: { id?: string; status?: string; created_at?: string; updated_at?: string };
        attestations?: Array<{ id?: string; status?: string; created_at?: string; updated_at?: string }>;
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
      const list: AttestationItem[] = [];
      if (result.success && Array.isArray(result.attestations)) {
        result.attestations.forEach((a) => {
          if (a?.id) {
            list.push({
              id: String(a.id),
              status: (a.status ?? "").toUpperCase(),
              createdAt: a.created_at,
              updatedAt: a.updated_at,
            });
          }
        });
      } else if (result.success && result.attestation?.id) {
        const a = result.attestation;
        list.push({
          id: String(a.id),
          status: (a.status ?? "").toUpperCase(),
          createdAt: a.created_at,
          updatedAt: a.updated_at,
        });
      }
      setAttestations(list);
    } catch {
      setError("Network or server error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAttestations();
  }, [fetchAttestations]);

  const draftAttestations = attestations.filter(
    (a) => (a.status ?? "").toUpperCase() === "DRAFT"
  );
  const completedAttestations = attestations.filter(
    (a) => (a.status ?? "").toUpperCase() === "COMPLETED"
  );

  return (
    <div className="vendor_overview_page sec_user_page org_settings_page">
      <div className="vendor_overview_heading page_header_align">
        <div className="vendor_overview_headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <LayoutDashboard size={24} />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Vendor Overview</h1>
            <p className="vendor_overview_subtitle page_header_subtitle">
              Manage your security profile and compliance attestations.
            </p>
          </div>
        </div>
      </div>

      <div className="vendor_overview_section">
        <h2 className="vendor_overview_section_title">My Attestations</h2>
        <p className="vendor_overview_section_subtitle">
          Your drafted attestations. Complete and submit to move them to Recent Self-Attestations.
        </p>
        {loading && (
          <div className="vendor_overview_loading">Loading attestations…</div>
        )}
        {error && (
          <div className="vendor_overview_error">{error}</div>
        )}
        {!loading && !error && draftAttestations.length === 0 && (
          <div className="vendor_overview_empty">
            No draft attestations. Complete an attestation to see it here.
          </div>
        )}
        {!loading && !error && draftAttestations.length > 0 && (
          <>
            {draftAttestations.map((item) => (
                <div
                  key={item.id}
                  className="vendor_overview_attestation_row"
                >
                  <FileText size={24} className="vendor_overview_attestation_icon" />
                  <div className="vendor_overview_attestation_content">
                    <p className="vendor_overview_attestation_name">
                      Vendor Self-Attestation
                    </p>
                    <p className="vendor_overview_attestation_date">
                      {formatUpdatedDate(item.updatedAt ?? item.createdAt)}
                    </p>
                  </div>
                  <div className="vendor_overview_attestation_actions">
                    <Link
                      to="/vendorSelfAttestation"
                      state={{ editId: item.id }}
                      className="vendor_overview_btn_update"
                    >
                      Update
                    </Link>
                  </div>
                </div>
            ))}
          </>
        )}
      </div>

      <div className="vendor_overview_section">
        <h2 className="vendor_overview_section_title">
          Recent Self-Attestations
        </h2>
        <p className="vendor_overview_section_subtitle">
          Your completed assessments and trust evaluations.
        </p>
        {loading && (
          <div className="vendor_overview_loading">Loading…</div>
        )}
        {!loading && completedAttestations.length === 0 && (
          <div className="vendor_overview_empty">
            No completed self-attestations yet.
          </div>
        )}
        {!loading && completedAttestations.length > 0 && (
          <>
            {completedAttestations.map((item) => (
              <div
                key={item.id}
                className="vendor_overview_attestation_row"
              >
                <CheckCircle2
                  size={24}
                  className="vendor_overview_attestation_icon vendor_overview_attestation_icon_check"
                />
                <div className="vendor_overview_attestation_content">
                  <p className="vendor_overview_attestation_name">
                    Vendor Self-Attestation
                  </p>
                  <p className="vendor_overview_attestation_date">
                    {formatCompletedDate(item.updatedAt ?? item.createdAt)}
                  </p>
                </div>
                <div className="vendor_overview_attestation_actions">
                  <Link
                    to="/attestation_details"
                    className="vendor_overview_btn_view"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

<<<<<<< HEAD
const RISK_BREAKDOWN = [
  { category: "Security", level: "Very Low", variant: "very_low" as const },
  { category: "Privacy", level: "Low", variant: "low" as const },
  { category: "Compliance", level: "Very Low", variant: "very_low" as const },
  { category: "Operational", level: "Low", variant: "low" as const },
  { category: "Technical", level: "Low", variant: "low" as const },
];

const formatGovDate = (dateStr: string | null | undefined): string => {
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

const getAssessmentLabel = (a: AssessmentRow): string => {
  const product = (a.productName ?? "").toString().trim();
  const vendor = (a.vendorName ?? "").toString().trim();
  if (product && vendor) return `${product} - ${vendor}`;
  if (product) return product;
  if (vendor) return vendor;
  return `Assessment #${a.assessmentId}`;
};

const getCompletedByDisplay = (a: AssessmentRow): string => {
  const first = (a.completedByUserFirstName ?? "").toString().trim();
  const last = (a.completedByUserLastName ?? "").toString().trim();
  const fullName = [first, last].filter(Boolean).join(" ");
  if (fullName) return fullName;
  const userName = (a.completedByUserName ?? "").toString().trim();
  if (userName) return userName;
  const email = (a.completedByUserEmail ?? "").toString().trim();
  if (email) return email;
  return "";
};

const BuyerOverview = () => {
  const navigate = useNavigate();
  const [assessmentsList, setAssessmentsList] = useState<AssessmentRow[]>([]);
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchAssessments = useCallback(() => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
    setFetchError(null);
    setLoading(true);
    const organizationId = sessionStorage.getItem("organizationId");
    const query = organizationId ? `?organizationId=${encodeURIComponent(organizationId)}` : "";
    fetch(`${BASE_URL}/assessments${query}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (result?.data?.assessments != null) {
          const list = result.data.assessments as AssessmentRow[];
          setAssessmentsList(list);
          const buyer = list.filter((a) => (a.type ?? "").toLowerCase() === "cots_buyer");
          const completed = buyer.filter((a) => (a.status ?? "").toLowerCase() !== "draft");
          setSelectedAssessmentId((prev) => {
            if (prev && completed.some((a) => String(a.assessmentId) === prev)) return prev;
            return completed.length > 0 ? String(completed[0].assessmentId) : "";
          });
        } else {
          setAssessmentsList([]);
          setSelectedAssessmentId("");
        }
      })
      .catch(() => {
        setFetchError("Failed to load assessments.");
        setAssessmentsList([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAssessments();
  }, [fetchAssessments]);

  const organizationId = sessionStorage.getItem("organizationId") ?? "";
  const orgScopedList = organizationId
    ? assessmentsList.filter((a) => String(a.organizationId ?? "") === String(organizationId))
    : assessmentsList;
  const buyerAssessments = orgScopedList.filter((a) => (a.type ?? "").toLowerCase() === "cots_buyer");
  const completedBuyerAssessments = buyerAssessments.filter((a) => (a.status ?? "").toLowerCase() !== "draft");
  const draftCount = buyerAssessments.filter((a) => (a.status ?? "").toLowerCase() === "draft").length;
  const completedCount = completedBuyerAssessments.length;
  const selectedAssessment = completedBuyerAssessments.find((a) => String(a.assessmentId) === selectedAssessmentId);

  const handleViewReport = (assessmentId: number) => {
    navigate("/reports", { state: { assessmentId } });
  };

  return (
    <div className="vendor_overview_page sec_user_page org_settings_page governance_overview">
      <div className="vendor_overview_heading page_header_align governance_overview_header">
        <div className="vendor_overview_headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <LayoutDashboard size={24} />
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Governance Overview</h1>
            <p className="vendor_overview_subtitle page_header_subtitle">
              Your AI risk posture and assessment pipeline.
            </p>
          </div>
        </div>
        <div className="vendor_overview_actions governance_overview_actions">
          <div className="governance_overview_select_wrap">
            <select
              className="governance_overview_select"
              value={selectedAssessmentId}
              onChange={(e) => setSelectedAssessmentId(e.target.value)}
              aria-label="Select assessment"
            >
              <option value="">Select an assessment</option>
              {completedBuyerAssessments.map((a) => (
                <option key={a.assessmentId} value={a.assessmentId}>
                  {getAssessmentLabel(a)}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="governance_overview_chevron governance_overview_chevron_select" aria-hidden />
          </div>
          <div className="btn_user_page">
            <Button className="invite_user_btn" onClick={() => navigate("/buyerAssessment")}>
              <Plus size={24} />
              Assessment
            </Button>
          </div>
        </div>
      </div>

      {loading && <div className="vendor_overview_loading">Loading assessments…</div>}
      {fetchError && <div className="vendor_overview_error">{fetchError}</div>}

      {!loading && (
        <>
          <div className="vendor_overview_metrics vendor_overview_metrics_four governance_overview_metrics">
            <MetricCard
              icon={<Activity size={20} />}
              title="Risk Database"
              value="1,248"
              description="Catalogued risks"
            />
            <MetricCard
              icon={<Shield size={20} />}
              title="Mitigations"
              value="4,603"
              description="Mapped strategies"
            />
            <MetricCard
              icon={<FileText size={20} />}
              title="Assessments"
              value={buyerAssessments.length}
              description={`${completedCount} completed, ${draftCount} pending`}
            />
            <MetricCard
              icon={<AlertTriangle size={20} />}
              title="Risk Domains"
              value="6"
              description="Active categories"
            />
          </div>

          {selectedAssessment && (
            <div className="governance_evaluation_card">
              <div className="governance_evaluation_header">
                <div className="governance_evaluation_title_meta">
                  <div className="governance_evaluation_title_block">
                    <Target size={20} className="governance_evaluation_target_icon" aria-hidden />
                    <h2 className="governance_evaluation_title">{getAssessmentLabel(selectedAssessment)}</h2>
                  </div>
                  <p className="governance_evaluation_meta">
                    COTS Assessment • {(selectedAssessment.status ?? "").toLowerCase() === "draft"
                      ? `Draft ${formatGovDate(selectedAssessment.cotsUpdatedAt ?? selectedAssessment.updatedAt ?? selectedAssessment.createdAt)}`
                      : (() => {
                          const by = getCompletedByDisplay(selectedAssessment);
                          const dateStr = formatGovDate(selectedAssessment.cotsUpdatedAt ?? selectedAssessment.updatedAt ?? selectedAssessment.createdAt);
                          return by ? `Completed by ${by}, ${dateStr}` : `Completed ${dateStr}`;
                        })()}
                  </p>
                </div>
                {(selectedAssessment.status ?? "").toLowerCase() === "draft" ? (
                  <Link to={`/buyerAssessment/${selectedAssessment.assessmentId}`} className="governance_evaluation_view_report">
                    Edit assessment
                    <Pencil size={16} />
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="governance_evaluation_view_report governance_evaluation_view_report_btn"
                    onClick={() => handleViewReport(selectedAssessment.assessmentId)}
                  >
                    View Report
                    <ExternalLink size={16} />
                  </button>
                )}
              </div>
              <div className="governance_evaluation_body">
                <div className="governance_kpis">
                  <KPICard value={91} label="Trust Score" variant="trust" />
                  <KPICard value={45} label="Inherent Risk" variant="inherent" />
                  <KPICard value="84%" label="Mitigation Effectiveness" variant="mitigation" />
                  <KPICard value="18.0" label="Residual Risk" variant="residual" />
                </div>
                <div className="governance_risk_breakdown">
                  <h3 className="governance_risk_breakdown_title">
                    <BarChart3 size={18} aria-hidden />
                    Risk Breakdown
                  </h3>
                  <ul className="governance_risk_list">
                    {RISK_BREAKDOWN.map(({ category, level, variant }) => (
                      <li key={category}>
                        <RiskCard category={category} level={level} variant={variant} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const Dashboard = () => {
  const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase().trim();

  if (systemRole === "system admin") {
    return <SystemAdminOverview />;
  }
=======
const Dashboard = () => {
  const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase();

>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
  if (systemRole === "vendor") {
    return <VendorOverview />;
  }

<<<<<<< HEAD
  return <BuyerOverview />;
=======
  return (
    <div className="sec_user_page">
      <div className="dashboard_placeholder">Dashboard</div>
    </div>
  );
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
};

export default Dashboard;
