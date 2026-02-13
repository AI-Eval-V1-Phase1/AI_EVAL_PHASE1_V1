import type { StepPropsVendorData } from "../../../types/formDataVendor";
import HeaderForVendor from "./HeaderForVendor";
import "./vendor_onboarding.css";
import { FileCheck } from "lucide-react";
import { Link } from "react-router-dom";
const StepVendorOnboardingPreview = ({
  formVendorData,
}: StepPropsVendorData) => {
  console.log(formVendorData);
  // console.log("role",role)

  const allSelectedSectors = [
    ...formVendorData.sector.public_sector,
    ...formVendorData.sector.private_sector,
    ...formVendorData.sector.non_profit_sector,
  ];

  console.log("data", allSelectedSectors);
  const datasector = formVendorData.sector.private_sector;
  console.log(datasector.length); // 3

  // Before the return
  const sectorMap: Record<string, string> = {
    public_sector: "Public",
    private_sector: "Private",
    non_profit_sector: "Non-Profit",
  };

  const publicSector = formVendorData.sector.public_sector;
  const privateSector = formVendorData.sector.private_sector;
  const nonProfitSector = formVendorData.sector.non_profit_sector;

  // Compute lengths
  const publicCount = publicSector.length;
  const privateCount = privateSector.length;
  const nonProfitCount = nonProfitSector.length;

  // Check if each sector has selections
  const hasPublic = publicCount > 0;
  const hasPrivate = privateCount > 0;
  const hasNonProfit = nonProfitCount > 0;

  // Check if all three have selections
  const allSelected = hasPublic && hasPrivate && hasNonProfit;

  return (
    <>
      <HeaderForVendor className="header_for_vendor" title_vendor="Preview" icon={<FileCheck size={18} />} />
      {/* <div className="vendor_preview_container"> */}
      <div>
        <div className="preview_sec">
          <h4>Company Profile</h4>
          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Vendor Type</p>
              <p className="preview_value">{formVendorData.vendorType}</p>
            </div>
            <div className="preview_item">
              <p className="preview_label">Industry Sector</p>

      
              </div>
              <div>  {hasPublic && (
                  <div className="sector_group">
                    <p>Public Sector:</p>
                    {/* <span className="sector_count">({publicCount})</span> */}
                    <div className="sector_tags">
                      {publicSector.map((item) => (
                        <span key={item} className="sector_tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasPrivate && (
                  <div className="sector_group">
                    <p>Private Sector:</p>
                    {/* <span className="sector_count">({privateCount})</span> */}
                    <div className="sector_tags">
                      {privateSector.map((item) => (
                        <span key={item} className="sector_tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {hasNonProfit && (
                  <div className="sector_group">
                    <p>Non-Profit Sector:</p>
                    {/* <span className="sector_count">({nonProfitCount})</span> */}
                    <div className="sector_tags">
                      {nonProfitSector.map((item) => (
                        <span key={item} className="sector_tag">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}</div>
            </div>

            {/* {allSelected && (
              <>
                <div>
                  {hasPublic && (
                    <div className="sector_group">
                      <strong>Public:</strong>
                      <span className="sector_count">({publicCount})</span>
                      <div className="sector_tags">
                        {publicSector.map((item) => (
                          <span key={item} className="sector_tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasPrivate && (
                    <div className="sector_group">
                      <strong>Private:</strong>
                      <span className="sector_count">({privateCount})</span>
                      <div className="sector_tags">
                        {privateSector.map((item) => (
                          <span key={item} className="sector_tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {hasNonProfit && (
                    <div className="sector_group">
                      <strong>Non-Profit:</strong>
                      <span className="sector_count">({nonProfitCount})</span>
                      <div className="sector_tags">
                        {nonProfitSector.map((item) => (
                          <span key={item} className="sector_tag">
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </>
            )} */}

            <div className="preview_item">
              <p className="preview_label">Vendor Maturity Stage</p>
              <p className="preview_value">{formVendorData.vendorMaturity}</p>
            </div>
            <div className="preview_item">
              <p className="preview_label">Company Website</p>
              <p className="preview_value">
                <Link to={formVendorData.companyWebsite}>
                  {formVendorData.companyWebsite}
                </Link>
              </p>
            </div>
            <div className="preview_item">
              <p className="preview_label">Company Description</p>
              <p
                className="preview_value_description"
                title="Cloud-based software provider specializing in secure enterprise solutions, data analytics, and AI-driven automation."
              >
                {formVendorData.companyDescription}
              </p>
            </div>
          </div>
        </div>
        <div className="preview_sec">
          <h4>Contact Information</h4>
          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Primary Contact Name</p>
              <p className="preview_value">
                {formVendorData.primaryContactName}
              </p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Primary Contact Email</p>
              <p className="preview_value">
                {formVendorData.primaryContactEmail}
              </p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Primary Contact Role</p>
              <p className="preview_value">
                {formVendorData.primaryContactName}
              </p>
            </div>
          </div>
        </div>
        <div className="preview_sec">
          <h4>Company Scale</h4>

          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Employee Count</p>
              <p className="preview_value">{formVendorData.employeeCount}</p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Year Founded</p>
              <p className="preview_value">{formVendorData.yearFounded}</p>
            </div>
          </div>
        </div>
        <div className="preview_sec">
          <h4>Geography</h4>
          <div className="preview_content">
            <div className="preview_item">
              <p className="preview_label">Headquarters Location</p>
              <p className="preview_value">
                {formVendorData.headquartersLocation}
              </p>
            </div>

            <div className="preview_item">
              <p className="preview_label">Operating Regions</p>
              <p className="preview_value">{formVendorData.operatingRegions}</p>
            </div>
          </div>
        </div>
      {/* </div> */}
    </>
  );
};

export default StepVendorOnboardingPreview;
