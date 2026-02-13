// src/config/navConfig.ts
import {
  Building2,
  ClipboardCheck,
  FileArchive,
  FileCheck,
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
  BotIcon,
<<<<<<< HEAD
  Layers,
=======
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
} from "lucide-react"

export interface NavItemConfig {
  label: string
  icon: LucideIcon
  path: string
  accessRoles: string[]
  systemRoles: string[]
}

export const NAVIGATION = {
  admin: [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      path: "/dashboard",
      accessRoles: ["admin", "user"],
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
      label: "Attestation",
      icon: FileCheck,
      path: "/attestation_details",
      accessRoles: ["admin", "user"],
      systemRoles: ["system admin", "vendor"],
    },
    {
      label: "Sales Agent",
      icon:  BotIcon,
      path: "/sales-enablement",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "vendor"],
    },
    {
      label: "Solutions Architect",
<<<<<<< HEAD
      icon: Layers,
=======
      icon: FileArchive,
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      path: "/evidence-library",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "vendor"],
    },
    {
      label: "Vendor Portal",
      icon: Building2,
      path: "/vendor-directory",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Assessments",
      icon: ClipboardCheck,
      path: "/assessments",
      accessRoles: ["admin", "user"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
    
    {
      label: "Risk Mapping",
      icon: Users,
      path: "/my-vendor",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Security Center",
      icon: Shield,
<<<<<<< HEAD
      path: "/security_center",
=======
      path: "/compilance",
>>>>>>> d489068cfa70d9e03e76d61725aed9495ad2eba8
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Testing",
      icon: Scale,
      path: "/governance",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer"],
    },
    {
      label: "Reports",
      icon: FileText,
      path: "/reports",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
    {
      label: "Product Profile",
      icon: Globe,
      path: "/product_profile",
      accessRoles: ["admin", "user"],
      systemRoles: ["system admin", "vendor"],
    },
    {
      label: "User Management",
      icon: UserCog,
      path: "/user-management",
      accessRoles: ["admin"],
      systemRoles: ["system admin", "buyer", "vendor"],
    },
  ] as NavItemConfig[],
}
