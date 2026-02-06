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
  Landmark,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  label: string;
  icon: LucideIcon;
}
export const NAVIGATION = {
  admin: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      accessRoles: ["admin","user"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },

    {
      label: "Organizations",
      icon: Landmark,
      path: "/organizations",
      accessRoles: ["admin"],
      systemRoles: ["system admin"],
    },
    {
      label: "Assessments",
      icon: ClipboardCheck,
      path: "/assessments",
     accessRoles: ["admin","user"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
    {
      label: "Vendor Directory",
      icon: Building2,
      path: "/vendor-directory",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "My Vendors",
      icon: Users,
      path: "/my-vendor",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Compliance",
      icon: Shield,
      path: "/compilance",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Governance",
      icon: Scale,
      path: "/governance",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Sales Enablement",
      icon: TrendingUp,
      path: "/sales-enablement",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "vendor"],
    },
    {
      label: "Evidence Library",
      icon: FileArchive,
      path: "/evidence-library",
     accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
    {
      label: "Reports",
      icon: FileText,
      path: "/reports",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
    {
      label: "Directory Listing",
      icon: Globe,
      path: "/directory-listing",
      accessRoles: ["admin"],
      systemRoles: ["system admin","vendor"],
    },
    {
      label: "User Management",
      icon: UserCog,
      path: "/user-management",
      accessRoles: ["admin", "user"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
  ],
};
