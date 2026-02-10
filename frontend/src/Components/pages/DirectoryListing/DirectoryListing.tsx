import { useEffect, useState, useCallback } from "react";
import ProductProfileView from "../ProductProfile/ProductProfileView";
import { buildFormStateFromApi } from "../../../utils/vendorAttestationState";
import type { VendorSelfAttestationFormState } from "../../../types/vendorSelfAttestation";

const BASE_URL = import.meta.env.VITE_BASE_URL ?? "http://localhost:5003/api/v1";

export interface ProductProfileProduct {
  id: string;
  productName: string;
  status: "Draft" | "Completed" | "Rejected";
  updated_at: string | null;
  /** When true, this product is visible to buyers when they view the vendor. Only applicable when status is Completed. */
  visibleToBuyer?: boolean;
}

export const DirectoryListing = () => {
  const [formState, setFormState] = useState<VendorSelfAttestationFormState | null>(null);
  const [products, setProducts] = useState<ProductProfileProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [publicListing, setPublicListing] = useState(false);
  const [publicListingUpdating, setPublicListingUpdating] = useState(false);
  const [publicListingError, setPublicListingError] = useState<string | null>(null);

  const fetchVendorPublicListing = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/vendorOnboarding`, {
        method: "GET",
        credentials: "include",
        headers: { Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      let data: { data?: { publicDirectoryListing?: boolean }; success?: boolean } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        setPublicListing(false);
        return;
      }
      setPublicListing(Boolean(res.ok && data?.data?.publicDirectoryListing === true));
    } catch {
      setPublicListing(false);
    }
  }, []);

  const fetchProductProfileData = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setLoading(false);
      return;
    }
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
        attestation?: { id?: string; status?: string; product_name?: string; created_at?: string; updated_at?: string; visible_to_buyer?: boolean };
        attestations?: { id?: string; status?: string; product_name?: string; created_at?: string; updated_at?: string; visible_to_buyer?: boolean }[];
        companyProfile?: Record<string, unknown>;
        message?: string;
      } = {};
      try {
        result = text ? JSON.parse(text) : {};
      } catch {
        setLoading(false);
        return;
      }
      if (!response.ok) {
        setLoading(false);
        return;
      }

      const items = Array.isArray(result.attestations)
        ? result.attestations
        : result.attestation
          ? [result.attestation]
          : [];
      const sorted = [...items].sort((a, b) => {
        const tA = a?.updated_at ?? a?.created_at ?? "";
        const tB = b?.updated_at ?? b?.created_at ?? "";
        return new Date(tB).getTime() - new Date(tA).getTime();
      });

      const productList: ProductProfileProduct[] = sorted
        .filter((a): a is typeof a & { id: string } => !!a?.id)
        .map((a) => {
          const apiStatus = (a.status ?? "").toUpperCase();
          const status: ProductProfileProduct["status"] =
            apiStatus === "COMPLETED" ? "Completed" : apiStatus === "REJECTED" ? "Rejected" : "Draft";
          const productName = (a.product_name ?? "").trim() || "Draft";
          return {
            id: a.id,
            productName,
            status,
            updated_at: a.updated_at ?? a.created_at ?? null,
            /** Default off when not set; only on when API explicitly sends true. */
            visibleToBuyer: a.visible_to_buyer === true,
          };
        });
      setProducts(productList);

      const latest = sorted[0];
      if (latest?.id) {
        const detailQuery = organizationId
          ? `?organizationId=${encodeURIComponent(organizationId)}&id=${encodeURIComponent(latest.id)}`
          : `?id=${encodeURIComponent(latest.id)}`;
        const detailRes = await fetch(`${BASE_URL}/vendorSelfAttestation${detailQuery}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const detailText = await detailRes.text();
        let detailResult: { success?: boolean; attestation?: Record<string, unknown>; companyProfile?: Record<string, unknown> } = {};
        try {
          detailResult = detailText ? JSON.parse(detailText) : {};
        } catch {
          setLoading(false);
          return;
        }
        if (detailRes.ok && detailResult.success && (detailResult.attestation || detailResult.companyProfile)) {
          setFormState(buildFormStateFromApi({
            companyProfile: detailResult.companyProfile,
            attestation: detailResult.attestation,
          }));
        }
      }
    } catch {
      // leave formState null
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchProductDetail = useCallback(async (id: string): Promise<VendorSelfAttestationFormState | null> => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) return null;
    const organizationId = sessionStorage.getItem("organizationId") ?? "";
    const query = organizationId
      ? `?organizationId=${encodeURIComponent(organizationId)}&id=${encodeURIComponent(id)}`
      : `?id=${encodeURIComponent(id)}`;
    try {
      const res = await fetch(`${BASE_URL}/vendorSelfAttestation${query}`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      if (!res.ok || !data.success) return null;
      return buildFormStateFromApi({
        companyProfile: data.companyProfile,
        attestation: data.attestation,
      });
    } catch {
      return null;
    }
  }, []);

  const handlePublicListingToggle = useCallback(async () => {
    const token = sessionStorage.getItem("bearerToken");
    if (!token) {
      setPublicListingError("Please log in to change this setting.");
      return;
    }
    const next = !publicListing;
    setPublicListingError(null);
    setPublicListingUpdating(true);
    try {
      const res = await fetch(`${BASE_URL}/vendorOnboarding/public-directory-listing`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ enabled: next }),
      });
      const text = await res.text();
      let data: { success?: boolean; message?: string } = {};
      try {
        if (text) data = JSON.parse(text);
      } catch {
        setPublicListingError(res.ok ? "Invalid response from server." : "Could not update. Try again.");
        setPublicListingUpdating(false);
        return;
      }
      if (res.ok && data?.success) {
        setPublicListing(next);
      } else {
        const message =
          res.status === 404
            ? "Complete vendor onboarding first to enable Public Directory Listing."
            : res.status === 401
              ? "Session expired. Please log in again."
              : (data?.message as string) || "Could not update. Try again.";
        setPublicListingError(message);
      }
    } catch {
      setPublicListingError("Network error. Check that the server is running and try again.");
    } finally {
      setPublicListingUpdating(false);
    }
  }, [publicListing]);

  const handleProductVisibilityToggle = useCallback(
    async (productId: string, visible: boolean) => {
      const token = sessionStorage.getItem("bearerToken");
      if (!token) return;
      try {
        const res = await fetch(`${BASE_URL}/vendorSelfAttestation/visibility`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ attestationId: productId, visible }),
        });
        const data = res.ok ? await res.json().catch(() => ({})) : {};
        if (res.ok && data?.success) {
          await fetchProductProfileData();
        }
      } catch {
        await fetchProductProfileData();
      }
    },
    [fetchProductProfileData]
  );

  const handleSectionVisibilityChange = useCallback(
    async (
      attestationId: string,
      sectionKey: "visible_ai_governance" | "visible_security_posture" | "visible_data_privacy" | "visible_compliance" | "visible_model_risk",
      value: boolean
    ) => {
      const token = sessionStorage.getItem("bearerToken");
      if (!token) return;
      await fetch(`${BASE_URL}/vendorSelfAttestation/section-visibility`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ attestationId, [sectionKey]: value }),
      });
    },
    []
  );

  useEffect(() => {
    fetchProductProfileData();
    fetchVendorPublicListing();
  }, [fetchProductProfileData, fetchVendorPublicListing]);

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "AI Eval | Product Profile";
    return () => {
      document.title = prevTitle;
    };
  }, []);

  if (loading) {
    return (
      <div className="product_profile_loading" style={{ padding: "2rem", textAlign: "center", color: "#6b7280" }}>
        Loading product profile…
      </div>
    );
  }

  return (
    <ProductProfileView
      formState={formState}
      products={products}
      fetchProductDetail={fetchProductDetail}
      trustScore="A+"
      compliancePercent="92%"
      publicListing={publicListing}
      onPublicListingToggle={handlePublicListingToggle}
      publicListingUpdating={publicListingUpdating}
      publicListingError={publicListingError}
      onProductVisibilityToggle={handleProductVisibilityToggle}
      onSectionVisibilityChange={handleSectionVisibilityChange}
    />
  );
};
