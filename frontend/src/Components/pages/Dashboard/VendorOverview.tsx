import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Eye,
  FileText,
  LayoutDashboard,
  Shield,
  ShieldCheck,
} from "lucide-react";
import DashboardMetricCard from "../../UI/DashboardMetricCard";
import LoadingMessage from "../../UI/LoadingMessage";
import Select from "../../UI/Select";
import type { AttestationItem, VendorAssessmentItem } from "./types";
import { BASE_URL, formatDisplayDate, getCompletedByDisplay } from "./utils";
import { formatDateDDMMMYYYY } from "../../../utils/formatDate";
import "./dashboard.css";

const VendorOverview = () => {
  const [attestations, setAttestations] = useState<AttestationItem[]>([]);
  const [assessments, setAssessments] = useState<VendorAssessmentItem[]>([]);
  const [reportsByAssessmentId, setReportsByAssessmentId] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [assessmentsLoading, setAssessmentsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompletedId, setSelectedCompletedId] = useState<string>("");

  const LOADER_MIN_MS = 2000;

  const fetchAttestations = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setError("Please log in to view attestations.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    const loadStart = Date.now();
    const finishLoading = () => {
      const remaining = Math.max(0, LOADER_MIN_MS - (Date.now() - loadStart));
      setTimeout(() => setLoading(false), remaining);
    };
    try {
      const response = await fetch(`${BASE_URL}/vendorSelfAttestation`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const text = await response.text();
      type AttestationRow = {
        id?: string;
        vendor_self_attestation_id?: string | null;
        status?: string;
        created_at?: string;
        updated_at?: string;
        expiry_at?: string | null;
        product_name?: string | null;
        certificates?: Array<{ name: string; expiryDate: string | null }>;
        generated_profile_report?: { trustScore?: { overallScore?: number; summary?: string; label?: string }; sections?: unknown[] };
      };
      let result: {
        success?: boolean;
        attestation?: AttestationRow;
        attestations?: AttestationRow[];
        message?: string;
      } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setError("Invalid response from server");
        finishLoading();
        return;
      }
      if (!response.ok) {
        setError((result.message as string) || "Failed to load attestations");
        finishLoading();
        return;
      }
      const list: AttestationItem[] = [];
      if (result.success && Array.isArray(result.attestations)) {
        result.attestations.forEach((a) => {
          if (a?.id) {
            list.push({
              id: String(a.id),
              vendor_self_attestation_id: a.vendor_self_attestation_id != null ? String(a.vendor_self_attestation_id) : undefined,
              status: (a.status ?? "").toUpperCase(),
              createdAt: a.created_at,
              updatedAt: a.updated_at,
              expiryDate: a.expiry_at ?? null,
              productName: a.product_name ?? undefined,
              certificates: Array.isArray(a.certificates) ? a.certificates : undefined,
              generated_profile_report: a.generated_profile_report,
            });
          }
        });
      } else if (result.success && result.attestation?.id) {
        const a = result.attestation;
        list.push({
          id: String(a.id),
          vendor_self_attestation_id: a.vendor_self_attestation_id != null ? String(a.vendor_self_attestation_id) : undefined,
          status: (a.status ?? "").toUpperCase(),
          createdAt: a.created_at,
          updatedAt: a.updated_at,
          expiryDate: a.expiry_at ?? null,
          productName: a.product_name ?? undefined,
          certificates: Array.isArray(a.certificates) ? a.certificates : undefined,
          generated_profile_report: a.generated_profile_report,
        });
      }
      setAttestations(list);
    } catch {
      setError("Network or server error");
    } finally {
      finishLoading();
    }
  }, []);

  /** Fetch assessments and customer risk reports (for View Report links). */
  const fetchAssessmentsAndReports = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    setAssessmentsLoading(true);
    const loadStart = Date.now();
    const finishLoading = () => {
      const remaining = Math.max(0, LOADER_MIN_MS - (Date.now() - loadStart));
      setTimeout(() => setAssessmentsLoading(false), remaining);
    };
    try {
      const [assessmentsRes, reportsRes] = await Promise.all([
        fetch(`${BASE_URL}/assessments`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${BASE_URL}/customerRiskReports`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const assessmentsData = await assessmentsRes.json().catch(() => ({}));
      const reportsData = await reportsRes.json().catch(() => ({}));
      const list: VendorAssessmentItem[] = Array.isArray(assessmentsData?.data?.assessments)
        ? assessmentsData.data.assessments
        : [];
      setAssessments(list);
      const byAssessmentId: Record<string, string> = {};
      if (reportsData?.success && Array.isArray(reportsData?.data?.reports)) {
        reportsData.data.reports.forEach((r: { id: string; assessmentId?: string }): void => {
          const aid = r.assessmentId != null ? String(r.assessmentId) : "";
          if (aid && r.id) byAssessmentId[aid] = String(r.id);
        });
      }
      setReportsByAssessmentId(byAssessmentId);
    } catch {
      setAssessments([]);
      setReportsByAssessmentId({});
    } finally {
      finishLoading();
    }
  }, []);

  useEffect(() => {
    fetchAttestations();
  }, [fetchAttestations]);

  useEffect(() => {
    fetchAssessmentsAndReports();
  }, [fetchAssessmentsAndReports]);

  /** Completed attestation is expired when expiry date is in the past (exclude from dropdown). */
  const isAttestationExpired = (item: AttestationItem): boolean => {
    if ((item.status ?? "").toUpperCase() !== "COMPLETED") return false;
    const exp = item.expiryDate;
    if (exp == null || String(exp).trim() === "") return false;
    const expiry = new Date(exp);
    if (Number.isNaN(expiry.getTime())) return false;
    const today = new Date();
    expiry.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    return expiry.getTime() < today.getTime();
  };

  /** Only completed, non-expired attestations (shown in dropdown). */
  const completedAttestations = attestations.filter(
    (a) => (a.status ?? "").toUpperCase() === "COMPLETED" && !isAttestationExpired(a)
  );

  /** Default dropdown to latest current (non-expired) completed attestation when data loads; clear if selected is expired */
  useEffect(() => {
    const current = attestations.filter(
      (a) => (a.status ?? "").toUpperCase() === "COMPLETED" && !isAttestationExpired(a)
    );
    const sorted = [...current].sort((a, b) => {
      const aDate = a.updatedAt ?? a.createdAt ?? "";
      const bDate = b.updatedAt ?? b.createdAt ?? "";
      return new Date(bDate).getTime() - new Date(aDate).getTime();
    });
    if (selectedCompletedId && !current.some((a) => a.id === selectedCompletedId)) {
      setSelectedCompletedId(sorted[0]?.id ?? "");
    } else if (sorted.length > 0 && !selectedCompletedId) {
      setSelectedCompletedId(sorted[0].id);
    }
  }, [attestations, selectedCompletedId]);
  /** Sorted by latest first (updatedAt desc) for dropdown default */
  const completedAttestationsSorted = [...completedAttestations].sort((a, b) => {
    const aDate = a.updatedAt ?? a.createdAt ?? "";
    const bDate = b.updatedAt ?? b.createdAt ?? "";
    return new Date(bDate).getTime() - new Date(aDate).getTime();
  });

  /** Selected attestation (product) – used for trust score and filtering assessments */
  const selectedAttestation = selectedCompletedId
    ? completedAttestations.find((a) => a.id === selectedCompletedId)
    : null;
  const trustScoreNum = selectedAttestation?.generated_profile_report?.trustScore?.overallScore;
  const trustScoreLabel = selectedAttestation?.generated_profile_report?.trustScore?.label;
  const trustScoreValue =
    trustScoreNum != null ? `${trustScoreNum}%` : "—";
  const trimmedLabel = trustScoreLabel ? String(trustScoreLabel).trim() : "";
  const trustScoreDescription =
    trustScoreNum != null
      ? (trimmedLabel && trimmedLabel !== "Not specified" ? trimmedLabel : "Product trust score")
      : selectedCompletedId
        ? "No trust score for this product yet."
        : "Select an attestation to see product trust score.";

  /** Certificates from the selected completed attestation only */
  const certificateListToShow = selectedCompletedId
    ? (completedAttestations.find((a) => a.id === selectedCompletedId)?.certificates ?? []).map((c) => ({
        ...c,
        attestationId: selectedCompletedId,
      }))
    : [];

  /** Assessments for the selected attestation/product (vendor COTS where vendor_attestation_id matches product/attestation id) */
  const selectedAttestationIds: string[] = selectedAttestation
    ? [
        String(selectedAttestation.id).trim(),
        selectedAttestation.vendor_self_attestation_id != null
          ? String(selectedAttestation.vendor_self_attestation_id).trim()
          : null,
      ].filter((x): x is string => x != null && x !== "")
    : [];
  const assessmentsForSelectedAttestation = selectedCompletedId && selectedAttestationIds.length > 0
    ? assessments.filter((a) => {
        if (a.type !== "cots_vendor") return false;
        const vid = (a.vendorAttestationId ?? "").toString().trim();
        return selectedAttestationIds.some((sid) => sid === vid);
      })
    : [];

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
              name="completed_attestations"
              value={selectedCompletedId}
              default_option="Select attestation"
              options={completedAttestationsSorted.map((item) => ({
                value: item.id,
                label: `${(item.productName ?? "").trim() || "Vendor Self-Attestation"} – ${formatDisplayDate(item.updatedAt ?? item.createdAt)}`,
              }))}
              onChange={(e) => setSelectedCompletedId(e.target.value)}
            />
          </div>
        )}
      </div>

      <div className="vendor_overview_metrics">
        <DashboardMetricCard
          title="Trust Score"
          icon={<Shield size={24} className="vendor_overview_metric_card_icon_blue" />}
          value={trustScoreValue}
          description={trustScoreDescription}
          valueVariant="grade"
          className="vendor_overview_metric_card_trust_score_full"
          iconPosition="left"
          loading={loading}
        />
      </div>

      <div className="vendor_overview_section">
        <h2 className="vendor_overview_section_title">Security & Compliance</h2>
        <p className="vendor_overview_section_subtitle">
          Security documents and compliance evidence.
        </p>
        {loading && <LoadingMessage message="Loading attestations…" />}
        {error && (
          <div className="vendor_overview_error">{error}</div>
        )}
        {!loading && !error && completedAttestations.length > 0 && (
          <>
            {certificateListToShow.length > 0 ? (
              certificateListToShow.map((cert, idx) => (
                <div
                  key={`${cert.attestationId}-${cert.name}-${idx}`}
                  className="vendor_overview_attestation_row"
                >
                  <ShieldCheck size={24} className="vendor_overview_attestation_icon vendor_overview_attestation_icon_check" aria-hidden />
                  <div className="vendor_overview_attestation_content">
                    <p className="vendor_overview_attestation_name">{cert.name}</p>
                    <p className="vendor_overview_attestation_status_label">Verified</p>
                    <p className="vendor_overview_attestation_date">
                      Expiry: {cert.expiryDate ? formatDisplayDate(cert.expiryDate) : "—"}
                    </p>
                  </div>
                  <div className="vendor_overview_attestation_actions">
                    <Link
                      to="/attestation_details"
                      state={{ attestationId: cert.attestationId }}
                      className="vendor_overview_btn_view"
                    >
                      <Eye size={16} aria-hidden />
                      View Document
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="vendor_overview_empty">No documents for this attestation.</div>
            )}
          </>
        )}
        {!loading && !error && completedAttestations.length === 0 && (
          <div className="vendor_overview_empty">
            No completed attestations yet. Complete an attestation to see documents here.
          </div>
        )}
      </div>

      <div className="vendor_overview_section">
        <h2 className="vendor_overview_section_title">
          Assessments
        </h2>
        <p className="vendor_overview_section_subtitle">
          Assessments completed for the selected attestation or product.
        </p>
        {!selectedCompletedId && completedAttestations.length > 0 && (
          <div className="vendor_overview_empty">
            Select an attestation above to see its assessments.
          </div>
        )}
        {selectedCompletedId && assessmentsLoading && (
          <LoadingMessage message="Loading assessments…" />
        )}
        {selectedCompletedId && !assessmentsLoading && assessmentsForSelectedAttestation.length === 0 && (
          <div className="vendor_overview_empty">
            No assessments yet for this attestation or product.
          </div>
        )}
        {selectedCompletedId && !assessmentsLoading && assessmentsForSelectedAttestation.length > 0 && (
          <div className="assessment_list_rows">
            {assessmentsForSelectedAttestation.map((item) => {
              const reportId = reportsByAssessmentId[String(item.assessmentId)];
              const org = (item.customerOrganizationName ?? "").toString().trim() || "—";
              const product = (item.productName ?? "").toString().trim() || "—";
              const title =
                org !== "—" || product !== "—"
                  ? `${org} - ${product}`
                  : `Assessment #${item.assessmentId}`;
              const isExpired =
                item.expiryAt != null &&
                String(item.expiryAt).trim() !== "" &&
                !Number.isNaN(new Date(item.expiryAt).getTime()) &&
                new Date(item.expiryAt).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
              const statusLabel = isExpired ? "Expired" : "Completed";
              const completedBy = getCompletedByDisplay(item) || "—";
              return (
                <div
                  key={item.assessmentId}
                  className="vendor_overview_attestation_row"
                >
                  <FileText
                    size={24}
                    className={
                      isExpired
                        ? "vendor_overview_attestation_icon vendor_overview_attestation_icon_expired"
                        : "vendor_overview_attestation_icon vendor_overview_attestation_icon_check"
                    }
                    aria-hidden
                  />
                  <div className="vendor_overview_attestation_content">
                    <p className="vendor_overview_attestation_name">{title}</p>
                    <p
                      className={
                        isExpired
                          ? "vendor_overview_attestation_status_label vendor_overview_attestation_status_label_expired"
                          : "vendor_overview_attestation_status_label"
                      }
                    >
                      {statusLabel}
                    </p>
                    <p className="vendor_overview_attestation_by">
                      Completed by: {completedBy}
                    </p>
                    <div className="vendor_overview_attestation_date_row">
                      <p className="vendor_overview_attestation_date">
                        Created on: {formatDateDDMMMYYYY(item.createdAt)}
                      </p>
                      <p className="vendor_overview_attestation_date vendor_overview_attestation_date_expiry">
                        Expires on: {formatDateDDMMMYYYY(item.expiryAt)}
                      </p>
                    </div>
                  </div>
                  <div className="vendor_overview_attestation_actions">
                    {reportId ? (
                      <Link
                        to={`/reports/${reportId}`}
                        className="vendor_overview_btn_view"
                      >
                        <Eye size={16} aria-hidden />
                        View Report
                      </Link>
                    ) : (
                      <span className="vendor_overview_attestation_date">No report yet</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorOverview;
