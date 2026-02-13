# Frontend constants

Folder path: `frontend/src/constants/`

---

## Vendor COTS Assessment (multistep form)

| File | Lines | Description |
|------|-------|-------------|
| `vendorCotsFormSchema.ts` | 1–190 | Form schema: sections (Customer Discovery, Solution Fit, Customer Risk Context, Competitive Analysis, Customer Risk Mitigation), field config (label, placeholder, inputType, optionsKey, required). |
| `vendorCotsOptions.ts` | 1–139 | Options/validation for select and multiselect: industry sector, budget range, implementation timeline, product features, implementation approach, customization level, integration complexity, regulatory requirements, data sensitivity, risk tolerance, customer-specific risks. `VENDOR_COTS_FIELD_OPTIONS`, `getVendorCotsFieldOptions()`. |

Full changelog and line-by-line references: see **`frontend/src/Components/pages/Assessments/VendorCOTS/README.md`**.
