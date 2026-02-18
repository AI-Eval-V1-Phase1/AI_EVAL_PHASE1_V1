import { useEffect, useState, useCallback } from "react";
import {
  Building2,
  Cpu,
  Database,
  FileCheck,
  FlaskConical,
  Search,
  ShieldCheck,
  X,
  ChevronRight,
} from "lucide-react";
import "./VendorDirectory.css";
import "../ProductProfile/product_profile.css";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

interface PublicVendor {
  id: string;
  organizationId: string;
  /** Organization name from org id (when provided by API). */
  organizationName?: string | null;
  /** Product names (completed, visible to buyer) from API. */
  productNames?: string[];
  vendorType: string;
  companyWebsite: string;
  companyDescription: string;
  headquartersLocation: string;
  vendorMaturity?: string;
}

interface VendorProduct {
  id: string;
  productName: string;
  status: string;
  updated_at: string | null;
}

function formatVal(val: unknown): string {
  if (val == null || val === "") return "Not specified.";
  if (Array.isArray(val)) return val.length ? val.join(", ") : "Not specified.";
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function truncate(s: string, maxLen: number): string {
  if (s.length <= maxLen) return s;
  return s.slice(0, maxLen).trim() + "...";
}

function productInitials(name: string): string {
  const s = (name || "Product").trim();
  if (s.length >= 2) return s.slice(0, 2).toUpperCase();
  return s ? s.toUpperCase() : "Pr";
}

type VendorTab = "all" | "listed" | "my";

const VendorDirectory = () => {
  useEffect(() => {
    document.title = "AI Eval | Vendor Portal";
  });
  const systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase().trim();
  const isBuyer = systemRole === "buyer";
  const [vendorTab, setVendorTab] = useState<VendorTab>("all");
  const [vendors, setVendors] = useState<PublicVendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [myVendors, setMyVendors] = useState<PublicVendor[]>([]);
  const [myVendorsLoading, setMyVendorsLoading] = useState(false);
  const [myVendorsError, setMyVendorsError] = useState<string | null>(null);
  const [selectedVendor, setSelectedVendor] = useState<PublicVendor | null>(null);
  const [vendorProducts, setVendorProducts] = useState<VendorProduct[]>([]);
  const [vendorProductsLoading, setVendorProductsLoading] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<{ id: string; productName: string } | null>(null);
  const [productDetail, setProductDetail] = useState<Record<string, unknown> | null>(null);
  const [productSectionVisibility, setProductSectionVisibility] = useState<{
    aiGovernance: boolean;
    securityPosture: boolean;
    dataPrivacy: boolean;
    compliance: boolean;
    modelRisk: boolean;
  } | null>(null);
  const [productDetailLoading, setProductDetailLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /** All Vendors: all vendors even if directory listing is off (backend returns all for system admin). */
  const fetchAllVendors = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setError("Please log in to view the vendor directory.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/vendorDirectory?scope=all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Failed to load vendors");
        setVendors([]);
        return;
      }
      setVendors(data?.vendors ?? []);
    } catch {
      setError("Network or server error");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Listed Vendors: only vendors who have turned on Public Directory Listing. */
  const fetchListedVendors = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setError("Please log in to view the vendor directory.");
      setLoading(false);
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/vendorDirectory`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.message ?? "Failed to load vendors");
        setVendors([]);
        return;
      }
      setVendors(data?.vendors ?? []);
    } catch {
      setError("Network or server error");
      setVendors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchMyVendors = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    setMyVendorsError(null);
    setMyVendorsLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/vendorDirectory/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setMyVendorsError(data?.message ?? "Failed to load my vendors");
        setMyVendors([]);
        return;
      }
      setMyVendors(data?.vendors ?? []);
    } catch {
      setMyVendorsError(null);
      setMyVendors([]);
    } finally {
      setMyVendorsLoading(false);
    }
  }, []);

  const fetchVendorProducts = useCallback(async (vendorId: string) => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    setVendorProductsLoading(true);
    setVendorProducts([]);
    try {
      const res = await fetch(`${BASE_URL}/vendorDirectory/${vendorId}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data?.products) setVendorProducts(data.products);
      else setVendorProducts([]);
    } catch {
      setVendorProducts([]);
    } finally {
      setVendorProductsLoading(false);
    }
  }, []);

  const fetchProductDetail = useCallback(async (vendorId: string, productId: string) => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    setProductDetailLoading(true);
    setProductDetail(null);
    setProductSectionVisibility(null);
    try {
      const res = await fetch(`${BASE_URL}/vendorDirectory/${vendorId}/products/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok && data?.attestation) {
        setProductDetail(data.attestation as Record<string, unknown>);
        const vis = data?.sectionVisibility;
        setProductSectionVisibility(vis ? {
          aiGovernance: vis.aiGovernance !== false,
          securityPosture: vis.securityPosture !== false,
          dataPrivacy: vis.dataPrivacy !== false,
          compliance: vis.compliance !== false,
          modelRisk: vis.modelRisk !== false,
        } : {
          aiGovernance: true,
          securityPosture: true,
          dataPrivacy: true,
          compliance: true,
          modelRisk: true,
        });
      } else {
        setProductDetail(null);
        setProductSectionVisibility(null);
      }
    } catch {
      setProductDetail(null);
      setProductSectionVisibility(null);
    } finally {
      setProductDetailLoading(false);
    }
  }, []);

  const handleVendorClick = (v: PublicVendor) => {
    setSelectedVendor(v);
    setSelectedProduct(null);
    setProductDetail(null);
    fetchVendorProducts(v.id);
  };

  const handleProductClick = (p: VendorProduct) => {
    if (!selectedVendor) return;
    setSelectedProduct({ id: p.id, productName: p.productName });
    fetchProductDetail(selectedVendor.id, p.id);
  };

  const buildDetailItemsFromAttestation = (att: Record<string, unknown>) => ({
    aiGovernance: [
      ["AI Ethics Policy", formatVal(att.unique_value_proposition) || "Not specified."],
      ["AI Ethics Board", formatVal(att.human_oversight) || "Not specified."],
      ["Human Oversight", formatVal(att.human_oversight) || formatVal(att.decision_autonomy) || "Not specified."],
      ["Model Governance", formatVal(att.model_transparency) || formatVal(att.training_data_documentation) || "Not specified."],
    ],
    security: [
      ["Security Certifications", formatVal(att.security_certifications) || "Not specified."],
      ["Access Controls", formatVal(att.adversarial_security_testing) || "Not specified."],
      ["Vulnerability Management", formatVal(att.adversarial_security_testing) || "Not specified."],
      ["Incident History", formatVal(att.incident_response_plan) || "Not specified."],
    ],
    dataPrivacy: [
      ["Data Types Processed", formatVal(att.pii_handling) || "Not specified."],
      ["Data Retention Policy", formatVal(att.data_retention_policy) || "Not specified."],
      ["Encryption Standards", formatVal(att.data_residency_options) || "Not specified."],
    ],
    compliance: [
      ["Regulatory Frameworks", formatVal(att.security_certifications) || "Not specified."],
      ["Certifications", formatVal(att.security_certifications) || formatVal(att.assessment_completion_level) || "Not specified."],
      ["Audit History", formatVal(att.assessment_completion_level) || "Not specified."],
    ],
    modelRisk: [
      ["Training Data Sources", formatVal(att.training_data_documentation) || "Not specified."],
      ["Model Monitoring", formatVal(att.model_transparency) || formatVal(att.rollback_capability) || "Not specified."],
      ["Bias Testing", formatVal(att.bias_testing_approach) || "Not specified."],
      ["Explainability", formatVal(att.model_transparency) || formatVal(att.decision_autonomy) || "Not specified."],
    ],
  });

  useEffect(() => {
    if (vendorTab === "all") {
      if (isBuyer) fetchListedVendors();
      else fetchAllVendors();
    } else if (vendorTab === "listed") fetchListedVendors();
    else if (vendorTab === "my") fetchMyVendors();
  }, [vendorTab, isBuyer, fetchAllVendors, fetchListedVendors, fetchMyVendors]);

  const displayName = (v: PublicVendor) => {
    if (v.organizationName && String(v.organizationName).trim()) return String(v.organizationName).trim();
    if (v.organizationId && v.organizationId !== v.companyWebsite) return v.organizationId;
    try {
      if (v.companyWebsite) {
        const url = new URL(v.companyWebsite.startsWith("http") ? v.companyWebsite : `https://${v.companyWebsite}`);
        return url.hostname.replace(/^www\./, "") || v.organizationId || "Vendor";
      }
    } catch {
      // ignore
    }
    return v.organizationId || "Vendor";
  };

  const matchesSearch = (v: PublicVendor, q: string): boolean => {
    if (!q.trim()) return true;
    const lower = q.trim().toLowerCase();
    const orgName = displayName(v).toLowerCase();
    if (orgName.includes(lower)) return true;
    const names = v.productNames ?? [];
    for (const p of names) {
      if (String(p).toLowerCase().includes(lower)) return true;
    }
    return false;
  };

  const filteredVendors = (list: PublicVendor[]) =>
    list.filter((v) => matchesSearch(v, searchQuery));

  const vendorsToShow = vendorTab === "my" ? filteredVendors(myVendors) : filteredVendors(vendors);

  const initials = (v: PublicVendor) => {
    const name = displayName(v);
    const parts = name.split(/[\s.-]+/).filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase().slice(0, 2);
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <div className="vendor_directory_page sec_user_page">
      <div className="vendor_directory_header page_header_align">
        <div className="page_header_row">
          <span className="icon_size_header" aria-hidden>
            <Building2 size={24} className="header_icon_svg"/>
          </span>
          <div className="page_header_title_block">
            <h1 className="page_header_title">AI Vendor Directory</h1>
            <p className="vendor_directory_subtitle page_header_subtitle">
              Browse vendors who have turned on Public Directory Listing.
            </p>
          </div>
        </div>
      </div>

      <div className="vendor_directory_tabs" role="tablist" aria-label="Vendor list type">
        <button
          type="button"
          role="tab"
          aria-selected={vendorTab === "all"}
          aria-controls="vendor-directory-panel-all"
          id="vendor-tab-all"
          className={`vendor_directory_tab ${vendorTab === "all" ? "vendor_directory_tab_active" : ""}`}
          onClick={() => setVendorTab("all")}
        >
          All Vendors
        </button>
        {!isBuyer && (
          <button
            type="button"
            role="tab"
            aria-selected={vendorTab === "listed"}
            aria-controls="vendor-directory-panel-listed"
            id="vendor-tab-listed"
            className={`vendor_directory_tab ${vendorTab === "listed" ? "vendor_directory_tab_active" : ""}`}
            onClick={() => setVendorTab("listed")}
          >
            Listed Vendors
          </button>
        )}
        <button
          type="button"
          role="tab"
          aria-selected={vendorTab === "my"}
          aria-controls="vendor-directory-panel-my"
          id="vendor-tab-my"
          className={`vendor_directory_tab ${vendorTab === "my" ? "vendor_directory_tab_active" : ""}`}
          onClick={() => setVendorTab("my")}
        >
          My Vendors
        </button>
      </div>

      {(vendorTab === "all" || vendorTab === "listed") && (
        <>
          {!loading && !error && vendors.length > 0 && (
            <div className="vendor_directory_search_wrap">
              <Search size={18} className="vendor_directory_search_icon" aria-hidden />
              <input
                type="search"
                className="vendor_directory_search_input"
                placeholder="Search by organization name or product name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search by organization name or product name"
              />
            </div>
          )}
          {loading && (
            <div className="vendor_directory_loading">Loading vendors…</div>
          )}
          {error && (
            <div className="vendor_directory_error">{error}</div>
          )}
          {!loading && !error && vendors.length === 0 && (
            <div className="vendor_directory_empty">
              {vendorTab === "listed" || (vendorTab === "all" && isBuyer)
                ? "No vendors have enabled Public Directory Listing yet."
                : "No vendors have completed onboarding yet."}
            </div>
          )}
          {!loading && !error && vendors.length > 0 && vendorsToShow.length === 0 && (
            <div className="vendor_directory_empty">
              No vendors match your search.
            </div>
          )}
          {!loading && !error && vendors.length > 0 && vendorsToShow.length > 0 && (
            <div
              className="vendor_directory_grid"
              id={vendorTab === "all" ? "vendor-directory-panel-all" : "vendor-directory-panel-listed"}
              role="tabpanel"
              aria-labelledby={vendorTab === "all" ? "vendor-tab-all" : "vendor-tab-listed"}
            >
              {vendorsToShow.map((v) => (
            <article
              key={v.id}
              className="vendor_directory_card vendor_directory_card_clickable"
              role="button"
              tabIndex={0}
              onClick={() => handleVendorClick(v)}
              onKeyDown={(e) => e.key === "Enter" && handleVendorClick(v)}
              aria-label={`View details for ${displayName(v)}`}
            >
              <div className="vendor_directory_card_avatar">
                {initials(v)}
              </div>
              <div className="vendor_directory_card_body">
                <h2 className="vendor_directory_card_name">{displayName(v)}</h2>
                {(v.productNames?.length ?? 0) > 0 && (
                  <p className="vendor_directory_card_products">
                    {v.productNames!.join(", ")}
                  </p>
                )}
                {v.vendorType && (
                  <p className="vendor_directory_card_type">{v.vendorType}</p>
                )}
                {v.companyDescription && (
                  <p className="vendor_directory_card_desc">
                    {v.companyDescription.slice(0, 160)}
                    {v.companyDescription.length > 160 ? "…" : ""}
                  </p>
                )}
                {v.headquartersLocation && (
                  <p className="vendor_directory_card_location">{v.headquartersLocation}</p>
                )}
                <span className="vendor_directory_card_action">
                  View details <ChevronRight size={16} aria-hidden />
                </span>
              </div>
            </article>
          ))}
            </div>
          )}
        </>
      )}

      {vendorTab === "my" && (
        <>
          {!myVendorsLoading && !myVendorsError && myVendors.length > 0 && (
            <div className="vendor_directory_search_wrap">
              <Search size={18} className="vendor_directory_search_icon" aria-hidden />
              <input
                type="search"
                className="vendor_directory_search_input"
                placeholder="Search by organization name or product name…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search by organization name or product name"
              />
            </div>
          )}
          {myVendorsLoading && (
            <div className="vendor_directory_loading">Loading my vendors…</div>
          )}
          {myVendorsError && (
            <div className="vendor_directory_error">{myVendorsError}</div>
          )}
          {!myVendorsLoading && !myVendorsError && myVendors.length === 0 && (
            <div className="vendor_directory_empty">
              NO vendor
            </div>
          )}
          {!myVendorsLoading && !myVendorsError && myVendors.length > 0 && vendorsToShow.length === 0 && (
            <div className="vendor_directory_empty">
              No vendors match your search.
            </div>
          )}
          {!myVendorsLoading && !myVendorsError && myVendors.length > 0 && vendorsToShow.length > 0 && (
            <div className="vendor_directory_grid" id="vendor-directory-panel-my" role="tabpanel" aria-labelledby="vendor-tab-my">
              {vendorsToShow.map((v) => (
            <article
              key={v.id}
              className="vendor_directory_card vendor_directory_card_clickable"
              role="button"
              tabIndex={0}
              onClick={() => handleVendorClick(v)}
              onKeyDown={(e) => e.key === "Enter" && handleVendorClick(v)}
              aria-label={`View details for ${displayName(v)}`}
            >
              <div className="vendor_directory_card_avatar">
                {initials(v)}
              </div>
              <div className="vendor_directory_card_body">
                <h2 className="vendor_directory_card_name">{displayName(v)}</h2>
                {(v.productNames?.length ?? 0) > 0 && (
                  <p className="vendor_directory_card_products">
                    {v.productNames!.join(", ")}
                  </p>
                )}
                {v.vendorType && (
                  <p className="vendor_directory_card_type">{v.vendorType}</p>
                )}
                {v.companyDescription && (
                  <p className="vendor_directory_card_desc">
                    {v.companyDescription.slice(0, 160)}
                    {v.companyDescription.length > 160 ? "…" : ""}
                  </p>
                )}
                {v.headquartersLocation && (
                  <p className="vendor_directory_card_location">{v.headquartersLocation}</p>
                )}
                <span className="vendor_directory_card_action">
                  View details <ChevronRight size={16} aria-hidden />
                </span>
              </div>
            </article>
          ))}
            </div>
          )}
        </>
      )}

      {/* Vendor detail modal: list of products (only those visible to buyers) */}
      {selectedVendor && (
        <div
          className="vendor_directory_modal_overlay"
          onClick={() => { setSelectedVendor(null); setVendorProducts([]); setSelectedProduct(null); setProductDetail(null); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="vendor_detail_modal_title"
        >
          <div className="vendor_directory_modal" onClick={(e) => e.stopPropagation()}>
            <div className="vendor_directory_modal_header">
              <h2 id="vendor_detail_modal_title" className="vendor_directory_modal_title">
                {displayName(selectedVendor)} – Products
              </h2>
              <button
                type="button"
                className="vendor_directory_modal_close"
                onClick={() => { setSelectedVendor(null); setVendorProducts([]); setSelectedProduct(null); setProductDetail(null); }}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="vendor_directory_modal_body">
              {vendorProductsLoading && (
                <div className="vendor_directory_loading">Loading products…</div>
              )}
              {!vendorProductsLoading && vendorProducts.length === 0 && (
                <p className="vendor_directory_empty_products">
                  No products are currently visible. The vendor can make products visible from their Product Profile.
                </p>
              )}
              {!vendorProductsLoading && vendorProducts.length > 0 && (
                <div className="vendor_directory_products_grid">
                  {vendorProducts.map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      className="vendor_directory_product_card"
                      onClick={() => handleProductClick(p)}
                      aria-label={`View details for ${p.productName}`}
                    >
                      <span className="vendor_directory_product_card_icon" aria-hidden>
                        {productInitials(p.productName)}
                      </span>
                      <div className="vendor_directory_product_card_content">
                        <span className="vendor_directory_product_card_name">{p.productName}</span>
                        <span className="vendor_directory_product_card_status">Completed</span>
                      </div>
                      <ChevronRight size={20} className="vendor_directory_product_card_arrow" aria-hidden />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Product detail modal: same detail cards as vendor View Product (no toggle) */}
      {selectedProduct && (
        <div
          className="vendor_directory_modal_overlay vendor_directory_modal_overlay_second"
          onClick={() => { setSelectedProduct(null); setProductDetail(null); setProductSectionVisibility(null); }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="product_detail_modal_title"
        >
          <div className="vendor_directory_modal vendor_directory_modal_large" onClick={(e) => e.stopPropagation()}>
            <div className="vendor_directory_modal_header">
              <h2 id="product_detail_modal_title" className="vendor_directory_modal_title">
                {selectedProduct.productName}
              </h2>
              <button
                type="button"
                className="vendor_directory_modal_close"
                onClick={() => { setSelectedProduct(null); setProductDetail(null); setProductSectionVisibility(null); }}
                aria-label="Close"
              >
                <X size={24} />
              </button>
            </div>
            <div className="vendor_directory_modal_body">
              {productDetailLoading && (
                <div className="vendor_directory_loading">Loading product details…</div>
              )}
              {!productDetailLoading && productDetail && productSectionVisibility && (() => {
                const detail = buildDetailItemsFromAttestation(productDetail);
                const vis = productSectionVisibility;
                const anyVisible = vis.aiGovernance || vis.securityPosture || vis.dataPrivacy || vis.compliance || vis.modelRisk;
                const detailItem = (label: string, value: string) => (
                  <li key={label} className="product_profile_detail_item">
                    <span className="product_profile_detail_label">{label}:</span>{" "}
                    <span className="product_profile_detail_value">{truncate(value, 200)}</span>
                  </li>
                );
                if (!anyVisible) {
                  return (
                    <p className="vendor_directory_empty_products">
                      No detail sections are currently visible for this product.
                    </p>
                  );
                }
                return (
                  <div className="product_profile_detail_grid">
                    {vis.aiGovernance && (
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <FlaskConical className="product_profile_detail_icon product_profile_icon_purple" size={24} aria-hidden />
                          <div>
                            <h3 className="product_profile_detail_title">AI Governance</h3>
                            <p className="product_profile_detail_subtitle">Ethics, oversight, and governance practices.</p>
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {detail.aiGovernance.map(([l, v]) => detailItem(l, String(v)))}
                        </ul>
                      </div>
                    )}
                    {vis.securityPosture && (
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <ShieldCheck className="product_profile_detail_icon product_profile_icon_blue" size={24} aria-hidden />
                          <div>
                            <h3 className="product_profile_detail_title">Security Posture</h3>
                            <p className="product_profile_detail_subtitle">Security controls and certifications.</p>
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {detail.security.map(([l, v]) => detailItem(l, String(v)))}
                        </ul>
                      </div>
                    )}
                    {vis.dataPrivacy && (
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <Database className="product_profile_detail_icon product_profile_icon_green" size={24} aria-hidden />
                          <div>
                            <h3 className="product_profile_detail_title">Data Privacy</h3>
                            <p className="product_profile_detail_subtitle">Data handling and privacy practices.</p>
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {detail.dataPrivacy.map(([l, v]) => detailItem(l, String(v)))}
                        </ul>
                      </div>
                    )}
                    {vis.compliance && (
                      <div className="product_profile_detail_card">
                        <div className="product_profile_detail_card_header">
                          <FileCheck className="product_profile_detail_icon product_profile_icon_green" size={24} aria-hidden />
                          <div>
                            <h3 className="product_profile_detail_title">Compliance</h3>
                            <p className="product_profile_detail_subtitle">Regulatory frameworks and certifications.</p>
                          </div>
                        </div>
                        <ul className="product_profile_detail_list">
                          {detail.compliance.map(([l, v]) => detailItem(l, String(v)))}
                        </ul>
                      </div>
                    )}
                    {vis.modelRisk && (
                      <div className="product_profile_detail_card product_profile_detail_card_span_2">
                        <div className="product_profile_detail_card_header">
                          <Cpu className="product_profile_detail_icon product_profile_icon_purple" size={24} aria-hidden />
                          <div>
                            <h3 className="product_profile_detail_title">Model Risk Management</h3>
                            <p className="product_profile_detail_subtitle">AI model governance and risk controls.</p>
                          </div>
                        </div>
                        <div className="product_profile_model_risk_columns">
                          <ul className="product_profile_detail_list">
                            {detail.modelRisk.slice(0, 2).map(([l, v]) => detailItem(l, String(truncate(String(v), 180))))}
                          </ul>
                          <ul className="product_profile_detail_list">
                            {detail.modelRisk.slice(2, 4).map(([l, v]) => detailItem(l, String(truncate(String(v), 180))))}
                          </ul>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorDirectory;
