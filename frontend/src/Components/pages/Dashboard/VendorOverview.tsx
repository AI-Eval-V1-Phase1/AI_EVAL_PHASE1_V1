import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  CheckCircle2,
  LayoutDashboard,
  ClipboardCheck,
  Info,
  ShieldCheck,
} from "lucide-react";
import DashboardMetricCard from "../../UI/DashboardMetricCard";
import Select from "../../UI/Select";
import type { AttestationItem } from "./types";
import { BASE_URL, formatUpdatedDate, formatCompletedDate, formatDisplayDate } from "./utils";
import "./dashboard.css";

const VendorOverview = () => {
  const [attestations, setAttestations] = useState<AttestationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompletedId, setSelectedCompletedId] = useState<string>("");

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
        attestation?: { id?: string; status?: string; created_at?: string; updated_at?: string; certificates?: Array<{ name: string; expiryDate: string | null }> };
        attestations?: Array<{ id?: string; status?: string; created_at?: string; updated_at?: string; certificates?: Array<{ name: string; expiryDate: string | null }> }>;
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
              certificates: Array.isArray(a.certificates) ? a.certificates : undefined,
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
          certificates: Array.isArray(a.certificates) ? a.certificates : undefined,
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
  /** Certificates from all completed attestations for "My Attestations" section */
  const certificateList = completedAttestations.flatMap((a) =>
    (a.certificates ?? []).map((c) => ({ ...c, attestationId: a.id }))
  );
  /** When an attestation is selected in the dropdown, show only that attestation's documents; otherwise show all */
  const certificateListToShow = selectedCompletedId
    ? certificateList.filter((c) => c.attestationId === selectedCompletedId)
    : certificateList;

  const profileCompleteness = completedAttestations.length > 0 ? 100 : draftAttestations.length > 0 ? 50 : 0;
  const profileCompleteLabel = profileCompleteness >= 100 ? "Profile complete!" : "Complete your attestation to improve.";
  const activeRequests = 0;

  return (
    <div className="vendor_overview_page sec_user_page org_settings_page">
      <div className="vendor_overview_heading page_header_align">
        <div className="vendor_overview_headers page_header_row">
          <span className="icon_size_header" aria-hidden>
            <LayoutDashboard size={24} className="header_icon_svg"/>
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">Vendor Dashboard</h1>
            <p className="sub_title page_header_subtitle">
              Manage your security profile and compliance attestations.
            </p>
          </div>
         
        </div>
         {!loading && completedAttestations.length > 0 && (
            <div className="vendor_overview_dropdown_top_right">
              <Select
                // labelName="Completed attestations"
                name="completed_attestations"
                value={selectedCompletedId}
                default_option="All completed attestations"
                options={completedAttestations.map((item) => ({
                  value: item.id,
                  label: `Vendor Self-Attestation – ${formatDisplayDate(item.updatedAt ?? item.createdAt)}`,
                }))}
                onChange={(e) => setSelectedCompletedId(e.target.value)}
              />
            </div>
          )}
      </div>

      <div className="vendor_overview_metrics">
        <DashboardMetricCard
          title="Profile Completeness"
          icon={<ClipboardCheck size={22} />}
          value={`${profileCompleteness}%`}
          description={profileCompleteLabel}
          progress={profileCompleteness}
        />
        {/* Active Request is not needed since there is no buyer to request */}
        {/* <DashboardMetricCard
          title="Active Requests"
          icon={<Info size={22} />}
          value={activeRequests}
          description="Customers requesting assessment"
        /> */}
        <DashboardMetricCard
          title="Trust Score"
          icon={<CheckCircle2 size={22} className="vendor_overview_metric_card_icon_green" />}
          value="A+"
          description="92% - Top tier AI vendor"
          valueVariant="grade"
        />
      </div>

      <div className="vendor_overview_section">
        <h2 className="vendor_overview_section_title">My Attestations</h2>
        <p className="vendor_overview_section_subtitle">
          Security documents and compliance evidence.
        </p>
        {loading && (
          <div className="vendor_overview_loading">Loading attestations…</div>
        )}
        {error && (
          <div className="vendor_overview_error">{error}</div>
        )}
        {!loading && !error && draftAttestations.length > 0 && (
          <>
            {draftAttestations.map((item) => (
              <div
                key={item.id}
                className="vendor_overview_attestation_row"
              >
                <FileText size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_draft" aria-hidden />
                <div className="vendor_overview_attestation_content">
                  <p className="vendor_overview_attestation_name">
                    Vendor Self-Attestation
                  </p>
                  <p className="vendor_overview_attestation_status_label vendor_overview_attestation_status_label_draft">
                    Draft
                  </p>
                  <p className="vendor_overview_attestation_date">
                    {formatUpdatedDate(item.updatedAt ?? item.createdAt)}
                  </p>
                </div>
                <div className="vendor_overview_attestation_actions">
                  <Link
                    to="/vendorSelfAttestation"
                    state={{ editId: item.id }}
                    className="vendor_overview_btn_view vendor_overview_btn_update"
                  >
                    Update
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && !error && certificateListToShow.length > 0 && (
          <>
            {certificateListToShow.map((cert, idx) => (
              <div
                key={`${cert.attestationId}-${cert.name}-${idx}`}
                className="vendor_overview_attestation_row"
              >
                <ShieldCheck size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_check" aria-hidden />
                <div className="vendor_overview_attestation_content">
                  <p className="vendor_overview_attestation_name">{cert.name}</p>
                  <p className="vendor_overview_attestation_status_label">
                    Verified
                  </p>
                  <p className="vendor_overview_attestation_date">
                    Expiry: {cert.expiryDate ? formatDisplayDate(cert.expiryDate) : "—"}
                  </p>
                </div>
                <div className="vendor_overview_attestation_actions">
                  <Link
                    to="/reports"
                    state={{ attestationId: cert.attestationId }}
                    className="vendor_overview_btn_view"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </>
        )}
        {!loading && !error && draftAttestations.length === 0 && certificateListToShow.length === 0 && (
          <div className="vendor_overview_empty">
            {selectedCompletedId
              ? "No documents for this attestation."
              : "No draft attestations. Complete an attestation to see certificates here."}
          </div>
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
                  aria-hidden
                />
                <div className="vendor_overview_attestation_content">
                  <p className="vendor_overview_attestation_name">
                    Vendor Self-Attestation
                  </p>
                  <p className="vendor_overview_attestation_status_label">
                    Completed
                  </p>
                  <p className="vendor_overview_attestation_date">
                    {formatCompletedDate(item.updatedAt ?? item.createdAt)}
                  </p>
                </div>
                <div className="vendor_overview_attestation_actions">
                  <Link
                    to="/reports"
                    state={{ attestationId: item.id }}
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

export default VendorOverview;
