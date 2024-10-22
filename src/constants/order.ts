import { pharmacistOrder } from "../utils/types";

export const PharmacistOrderTableKeys: (keyof pharmacistOrder)[] = [
  "order_id",
  //"products",
  "contact_name",
  //"address",
  //"contact_phone",
  //"logistic_name",
  //"logistic_cost",
  //"amount",
  "created_at",
  "updated_at",
];

export const PharmacistOrderTableSortKeys: (keyof pharmacistOrder)[] = [
  "contact_name",
  "created_at",
  "updated_at",
];

export const PharmacistOrderStatus = [
  "Waiting for payment",
  "Processed",
  "Sent",
  "Order Confirmed",
  "Canceled",
];

export const OrderStatusColor = [
  ["#da6000", "#fff2e3"],
  ["#b88d00", "#ffffe4"],
  ["#13a100", "#e8ffe3"],
  ["#0084a1", "#e3f6ff"],
  ["#da0000", "#ffe3e3"],
];
