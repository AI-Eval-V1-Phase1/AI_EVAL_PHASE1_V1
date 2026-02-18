import SystemAdminOverview from "./SystemAdminOverview";
import VendorOverview from "./VendorOverview";
import BuyerOverview from "./BuyerOverview";

const Dashboard = () => {
  let systemRole = (sessionStorage.getItem("systemRole") ?? "").toLowerCase().trim();
  if (systemRole === "system_admin") systemRole = "system admin";

  if (systemRole === "system admin") {
    return <SystemAdminOverview />;
  }
  if (systemRole === "vendor") {
    return <VendorOverview />;
  }

  return <BuyerOverview />;
};

export default Dashboard;
