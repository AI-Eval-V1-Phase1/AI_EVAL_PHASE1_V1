import HeaderForVendor from "./HeaderForVendor";
import "./vendor_onboarding.css";

import { Link } from "react-router-dom";
const StepVendorOnboardingPreview = () => {
  return (
    <>
      <HeaderForVendor title_vendor="Preview" />
      <div className="vendor_preview_container">
        <div className="preview_sec">
          <h4>Company Profile</h4>
          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Vendor Type</p>
              <p className="preview_value">Software Vendor</p>
            </div>
            <div className="preview_item">
              <p className="preview_label">Vendor Maturity Stage</p>
              <p className="preview_value">Startup</p>
            </div>
            <div className="preview_item">
              <p className="preview_label">Company Website</p>
              <p className="preview_value">
                <Link to="https://company_website.com">
                  https://company_website.com
                </Link>
              </p>
            </div>
            <div className="preview_item">
              <p className="preview_label">Company Description</p>
              <p
                className="preview_value_description"
                title="Cloud-based software provider specializing in secure enterprise solutions, data analytics, and AI-driven automation."
              >
                cloud-based software provider specializing in secure enterprise
                solutions, data analytics, and AI-driven automation.
              </p>
            </div>
          </div>
        </div>
        <div className="preview_sec">
          <h4>Contact Information</h4>
          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Primary Contact Name</p>
              <p className="preview_value">John Doe</p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Primary Contact Email</p>
              <p className="preview_value">john.doe@company.com</p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Primary Contact Role</p>
              <p className="preview_value">Head of Procurement</p>
            </div>
          </div>
        </div>
        <div className="preview_sec">
          <h4>Company Scale</h4>

          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Employee Count</p>
              <p className="preview_value">120</p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Year Founded</p>
              <p className="preview_value">2015</p>
            </div>
          </div>
        </div>
        <div className="preview_sec">
          <h4>Geography</h4>
          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Headquarters Location</p>
              <p className="preview_value">San Francisco, CA, USA</p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Operating Regions</p>
              <p className="preview_value">North America, Europe, Asia</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default StepVendorOnboardingPreview;
