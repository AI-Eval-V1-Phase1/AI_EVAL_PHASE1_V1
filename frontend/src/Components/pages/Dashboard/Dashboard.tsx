import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { FileText, CheckCircle2, LayoutDashboard } from "lucide-react";
import "./Dashboard.css";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

interface AttestationItem {
  id: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const formatUpdatedDate = (dateStr: string | null | undefined): string => {
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

const Dashboard = () => {
  const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase();

  if (systemRole === "vendor") {
    return <VendorOverview />;
  }

  return (
    <div className="sec_user_page">
      <div className="dashboard_placeholder">Dashboard</div>
    </div>
  );
};

export default Dashboard;
