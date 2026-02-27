export interface AssessmentRow {
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

export interface DashboardStats {
  totalOrganizations: number;
  totalVendors: number;
  totalBuyers: number;
  totalAttestations: number;
}

export interface CertificateItem {
  name: string;
  expiryDate: string | null;
}

export interface AttestationItem {
  id: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
  /** Product name from attestation (display label); fallback "Vendor Self-Attestation" when empty */
  productName?: string | null;
  /** Certificates uploaded in self-attestation (from backend) */
  certificates?: CertificateItem[];
}
