-- Customer Risk Assessment reports: generated when a vendor COTS assessment is submitted.
-- Title: "Customer Risk Assessment: {organization name} - {product name}"
CREATE TABLE IF NOT EXISTS customer_risk_assessment_reports (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assessment_id uuid NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
  organization_id varchar(255) NOT NULL,
  title varchar(500) NOT NULL,
  report jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_risk_reports_org_id ON customer_risk_assessment_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_customer_risk_reports_assessment_id ON customer_risk_assessment_reports(assessment_id);
CREATE INDEX IF NOT EXISTS idx_customer_risk_reports_created_at ON customer_risk_assessment_reports(created_at DESC);

COMMENT ON TABLE customer_risk_assessment_reports IS 'Reports generated when vendor COTS assessment is completed; displayed in Reports Library as Customer Risk Assessment: org - product.';
