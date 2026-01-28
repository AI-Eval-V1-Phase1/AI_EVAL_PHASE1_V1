import React from "react";
import Input from "../../UI/Input";
import HeaderForVendor from "./HeaderForVendor";
import Select from "../../UI/Select";
const StepCompanyProfile = () => {
  const VENDOR_TYPES = [
    {
      value: "agentic_ai_industry",
      label:
        "Agentic AI for Industries - Healthcare, legal, finance, or other specialized AI agents",
    },
    {
      value: "ai_platform_provider",
      label:
        "AI Platform Provider - Workflow automation and orchestration (n8n, Make, Zapier AI)",
    },
    {
      value: "ai_developer_tools",
      label:
        "AI Developer Tools - Code assistants, IDEs, dev platforms (Claude Code, Replit, Cursor)",
    },
    {
      value: "ai_productivity_apps",
      label:
        "AI Productivity Apps - Note-taking, document processing, knowledge management",
    },
  ];

  const VENDOR_MATURITY_LEVELS = [
    { value: "startup", label: "Startup - Early-stage, innovative solutions" },
    { value: "growth_stage", label: "Growth Stage - Scaling customer base" },
    { value: "established", label: "Established - Proven track record" },
    {
      value: "enterprise",
      label: "Enterprise - Large-scale global operations",
    },
  ];
  return (
    <>
      <HeaderForVendor
        className="header_for_vendor"
        title_vendor="Company Profile"
        sub_title_vendor="Tell us about your AI products and services"
      />

      {/* <div className="step_form_body"> */}
      <div>
        {/* <div className="step_form_right"> */}
        <div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                  Vendor Type <span className="mandatory">*</span>
                </>
              }
              id="vendor_type"
              name="vendor_type"
              value=""
              default_option="Select Vendor Type"
              options={VENDOR_TYPES}
            />
          </div>
          <div className="form_fields_vendor">
            <Select
              labelName={
                <>
                 Vendor Maturity Stage <span className="mandatory">*</span>
                </>
              }
              id="vendor_type"
              name="vendor_type"
              value=""
              default_option="Select Vendor Maturity Stage"
              options={VENDOR_MATURITY_LEVELS}
            />
          </div>
        </div>
        {/* <div className="step_form_left"> */}
        <div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                Company Website <span className="mandatory">*</span>
                </>
              }
              type="text"
              id="company_website"
              name="company_website"
              value=""
              onChange=""
            />
          </div>
          <div className="form_fields_vendor">
            <Input
              labelName={
                <>
                Company Description<span className="mandatory">*</span>
                </>
              }
              type="textarea"
              id="company_description"
              name="company_description"
              value="www"
              onChange=""
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default StepCompanyProfile;
