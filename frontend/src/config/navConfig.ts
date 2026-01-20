// src/config/navConfig.js
import {
  Building2,
  ClipboardCheck,
  FileArchive,
  FileText,
  Globe,
  LayoutDashboard,
  Scale,
  Shield,
  TrendingUp,
  UserCog,
  Users,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
}
export const NAVIGATION = {
  admin: [
    { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { label: "Assessments", icon: ClipboardCheck, path: "/assessments" },
    { label: "Vendor Directory", icon: Building2, path: "/vendor-directory" },
    { label: "My Vendors", icon: Users, path: "/my-vendor" },
    { label: "Compliance", icon: Shield,  path: "/compilance" },
    { label: "Governance", icon: Scale, path: "/governance" },
    { label: "Sales Enablement", icon: TrendingUp, path: "/sales-enablement" },
    { label: "Evidence Library", icon: FileArchive,  path: "/evidence-library"},
    { label: "Reports", icon: FileText,  path: "/reports" },
    { label: "Directory Listing", icon: Globe, path:"/directory-listing" },
    { label: "User Management", icon: UserCog, path: "/user-management" },
  ],
};
