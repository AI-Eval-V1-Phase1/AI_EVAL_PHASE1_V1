// VENDOR ONBOARDING TYPES

import type { ChangeEvent } from "react";
export interface VendorDataInterface {
  vendorType: string;
  sector: {
    public_sector: string[];
    private_sector: string[];
    non_profit_sector: string[];
  };
  vendorMaturity: string;
  companyWebsite: string;
  companyDescription: string;
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  employeeCount: string;
  yearFounded: number;
  headquartersLocation: string;
  operatingRegions: string[];
}

export interface StepPropsVendorData {
  formVendorData: VendorDataInterface;
  setFormVendorData: React.Dispatch<React.SetStateAction<VendorDataInterface>>;
}

export type FormElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

export type FormChangeEvent = ChangeEvent<FormElement>;
