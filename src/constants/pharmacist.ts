import { pharmacist } from "../utils/types";

export const ErrRequiredField = "This field is required";
export const ErrMustBeAPositiveNumber = "Must be a positive number";
export const ErrMustBeANumber = "Must be a number";
export const ErrMustBeLess = "Must be less than operational stop";
export const ErrMustBeMore = "Must be more than operational start";

export const PharmacistKeys: (keyof pharmacist)[] = [
  "name",
  "email",
  "sipa_number",
  "whatsapp_number",
  "years_of_experience",
  "is_assigned",
];

export const PharmacistTableFields = [
  "id",
  "name",
  "email",
  "sipa_number",
  "whatsapp_number",
  "years_of_experience",
  "action",
];

export const PharmacistEditFields: (keyof pharmacist)[] = [
  "name",
  "email",
  "sipa_number",
  "whatsapp_number",
  "years_of_experience",
];

export const PharmacistFilterKeys: (keyof pharmacist)[] = [
  "name",
  "sipa_number",
  "whatsapp_number",
  "years_of_experience",
];

export const PharmacistSortKeys: (keyof pharmacist)[] = ["name", "is_assigned"];
