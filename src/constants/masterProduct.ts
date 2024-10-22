import {
  createMasterProductRequest,
  masterProduct,
  masterProductForm,
} from "../utils/types";

export const ErrRequiredField = "This field is required";
export const ErrMustBeAPositiveNumber = "Must be a positive number";
export const ErrMustBeANumber = "Must be a number";
export const ErrMustBeLess = "Must be less than operational stop";
export const ErrMustBeMore = "Must be more than operational start";
export const ErrFileSize = "File size must be less than 500kB";
export const ErrName = "Name length must be less equal than 75 characters";
export const ErrDropdown = "Please choose from dropdown";

export const MasterProductKeys: (keyof masterProduct)[] = [
  "name",
  "manufacturer",
  "product_classification",
  "product_form",
  "is_active",
];

export const MasterProductSortKeys: (keyof masterProduct)[] = ["name"];

export const MasterProductCreateKeys: {
  keys: keyof masterProductForm;
  type: string;
}[] = [
  { keys: "name", type: "text" },
  { keys: "manufacturer", type: "text" },
  { keys: "product_classification", type: "text" },
  { keys: "product_form", type: "text" },
  { keys: "generic_name", type: "text" },
  { keys: "description", type: "text" },
  { keys: "unit_in_pack", type: "text" },
  { keys: "selling_unit", type: "text" },
  { keys: "weight", type: "text" },
  { keys: "height", type: "text" },
  { keys: "length", type: "text" },
  { keys: "width", type: "text" },
  { keys: "categories", type: "text" },
  { keys: "image_url", type: "file" },
  { keys: "is_active", type: "checkbox" },
];

export const MasterProductCreateRequest: (keyof createMasterProductRequest)[] =
  [
    "name",
    "manufacturer_id",
    "product_classification_id",
    "product_form_id",
    "generic_name",
    "description",
    "unit_in_pack",
    "selling_unit",
    "weight",
    "height",
    "length",
    "width",
    "categories",
    "image_url",
    "is_active",
  ];
