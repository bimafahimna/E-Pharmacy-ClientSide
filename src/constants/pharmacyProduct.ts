import { pharmacyProduct } from "../utils/types";

export const ErrRequiredField = "This field is required";
export const ErrMustBeAPositiveNumber = "Must be a positive number";
export const ErrMustBeANumber = "Must be a number";
export const ErrMustBeLess = "Must be less than operational stop";
export const ErrMustBeMore = "Must be more than operational start";
export const ErrFileSize = "File size must be less than 500kB";
export const ErrName = "Name length must be less equal than 75 characters";
export const ErrDropdown = "Please choose from dropdown";

export const PharmacyProductKeys: (keyof pharmacyProduct)[] = [
  "name",
  "generic_name",
  "manufacturer",
  "product_form",
  "is_active",
];

export const PharmacyProductSortKeys: (keyof pharmacyProduct)[] = ["name"];
