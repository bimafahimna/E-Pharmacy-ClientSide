import { createPartnerRequest, partner } from "../utils/types";

export const ErrRequiredField = "This field is required";
export const ErrMustBeAPositiveNumber = "Must be a positive number";
export const ErrMustBeANumber = "Must be a number";
export const ErrMustBeLess = "Must be less than operational stop";
export const ErrMustBeMore = "Must be more than operational start";
export const ErrFileSize = "File size must be less than 500kB";

export const PartnerKeys: (keyof partner)[] = [
  "id",
  "name",
  "logo_url",
  "year_founded",
  "active_days",
  "operational_start",
  "operational_stop",
  "is_active",
  "created_at",
  "updated_at",
];

export const PartnerFiltersKeys: (keyof partner)[] = [
  "name",
  "active_days",
  "year_founded",
  "operational_start",
  "is_active",
];

export const PartnerSortKeys: (keyof partner)[] = [
  "name",
  "year_founded",
  "operational_start",
  "operational_stop",
  "is_active",
  "created_at",
  "updated_at",
];

export const PartnerCreateRequestKeys: (keyof createPartnerRequest)[] = [
  "name",
  "year_founded",
  "active_days",
  "operational_start",
  "operational_stop",
  "logo_url",
  "is_active",
];

export const PartnerEditRequestKeys: (keyof partner)[] = [
  "name",
  "year_founded",
  "active_days",
  "operational_start",
  "operational_stop",
  "logo_url",
  "is_active",
];
