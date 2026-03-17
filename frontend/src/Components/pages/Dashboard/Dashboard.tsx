import SystemAdminOverview from "./SystemAdminOverview";
import VendorOverview from "./VendorOverview";
import BuyerOverview from "./BuyerOverview";

const Dashboard = () => {
  document.title = "AI Eval | Dashboard"
  let systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase().trim().replace(/_/g, " ");
  if (systemRole === "system_admin") systemRole = "system admin";
  if (systemRole === "system_manager") systemRole = "system manager";
  if (systemRole === "ai_directory_curator") systemRole = "ai directory curator";

  if (systemRole === "system admin") {
    return <SystemAdminOverview />;
  }
  if (systemRole === "system manager") {
    return <SystemAdminOverview />;
  }
  if (systemRole === "system viewer") {
    return <SystemAdminOverview viewOnly />;
  }
  if (systemRole === "vendor") {
    return <VendorOverview />;
  }
  // AI Directory Curator: dashboard view only (metrics, no create/edit actions)
  if (systemRole === "ai directory curator") {
    return <SystemAdminOverview viewOnly />;
  }

  return <BuyerOverview />;
};

export default Dashboard;
