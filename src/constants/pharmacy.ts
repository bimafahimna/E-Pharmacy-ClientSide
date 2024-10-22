import { pharmacy } from "../utils/types";

export const PharmacyKeys: (keyof pharmacy)[] = [
  "id",
  "name",
  "pharmacist",
  "partner",
  "address",
  "city",
  "latitude",
  "longitude",
];

export const PharmacyTableKeys: (keyof pharmacy)[] = [
  "name",
  "pharmacist",
  "partner",
  "address",
  "city",
  "is_active",
];

export const PharmacySortKeys: (keyof pharmacy)[] = ["name"];
export const PharmacyFilterKeys: (keyof pharmacy)[] = ["name"];
